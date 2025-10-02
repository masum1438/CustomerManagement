import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';
import { Router, RouterModule } from '@angular/router';
import { Customer } from '../customer.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-list',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerList implements OnInit {
customers: Customer[] = [];
query = '';
constructor(private service:CustomerService,private router:Router)
{}
ngOnInit(){
  this.load();
}
load(){
  this.service.getAll().subscribe(data => this.customers=data);
}
view(id:number | undefined){
  this.router.navigate(['customer-details',id]);

}
edit(id:number | undefined){
  this.router.navigate(['customer-update',id]);
}
 delete(id:number | undefined){
  if (!id) return;
  if(confirm('Are you sure?')){
    this.service.delete(id).subscribe(()=>this.load());
  }
 }
 printList() {
    this.router.navigate(['customer-print']);
  }
  printSingle(id: number | undefined) {
  if (!id) return;
  this.router.navigate(['customer-singleprint', id]);
}


  filtered() {
    if (!this.query) return this.customers;
    const q = this.query.toLowerCase();
    return this.customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q)
    );
  }


  //download in pdf format
downloadPDF(data: any[] | any) {
  const filename = 'customers.pdf';
  const items = Array.isArray(data) ? data : [data];
  if (!items || items.length === 0) return;

  const headers = ['name', 'email', 'phone', 'address', 'balance', 'status'];

  const pageWidth = 612;
  const pageHeight = 792;
  const leftMargin = 50;
  const topMargin = 720; // lower table start to make space for header
  const columnWidths = [100, 120, 80, 120, 60, 60];
  const rowHeight = 20;
  const cellPadding = 3;

  let y = topMargin;
  let content = 'BT\n';

  // --- Document Title ---
  const title = "Customer List";
  const titleX = pageWidth / 2 - (title.length * 4); // rough centering
  const titleY = 760;
  content += '/F1 16 Tf\n'; // bigger bold font
  content += `1 0 0 1 ${titleX} ${titleY} Tm\n(${this.escapePDFString(title)}) Tj\n`;

  // --- Table Header ---
  content += '/F1 12 Tf\n';
  // background for header row
  content += 'q\n0.9 0.9 0.9 rg\n';
  content += `${leftMargin} ${y - rowHeight + 3} ${columnWidths.reduce((a, b) => a + b, 0)} ${rowHeight} re f\nQ\n`;

  // header text
  let x = leftMargin;
  headers.forEach((h, i) => {
    content += `1 0 0 1 ${x + cellPadding} ${y - 14} Tm\n(${this.escapePDFString(h.toUpperCase())}) Tj\n`;
    x += columnWidths[i];
  });
  y -= rowHeight;

  // --- Data Rows ---
  content += '/F2 10 Tf\n';
  items.forEach((item, idx) => {
    if (idx % 2 === 0) {
      content += 'q\n0.95 0.95 0.95 rg\n';
      content += `${leftMargin} ${y - rowHeight + 3} ${columnWidths.reduce((a, b) => a + b, 0)} ${rowHeight} re f\nQ\n`;
    }

    x = leftMargin;
    headers.forEach((h, i) => {
      const val = item[h] != null ? String(item[h]) : '';
      content += `1 0 0 1 ${x + cellPadding} ${y - 14} Tm\n(${this.escapePDFString(val)}) Tj\n`;
      x += columnWidths[i];
    });
    y -= rowHeight;
  });

  content += 'ET\n'; // close text block

  // --- Table Borders ---
  content += '0.5 w\n';
  let tableWidth = columnWidths.reduce((a, b) => a + b, 0);
  let tableHeight = topMargin - y;
  content += `${leftMargin} ${y} ${tableWidth} ${tableHeight} re S\n`;

  // vertical lines
  let vx = leftMargin;
  columnWidths.forEach(w => {
    vx += w;
    content += `${vx} ${y} m ${vx} ${topMargin} l S\n`;
  });

  // horizontal lines
  let rowY = topMargin;
  for (let i = 0; i <= items.length; i++) {
    content += `${leftMargin} ${rowY - rowHeight} m ${leftMargin + tableWidth} ${rowY - rowHeight} l S\n`;
    rowY -= rowHeight;
  }

  // --- Build objects ---
  const encoder = new TextEncoder();
  const streamBytes = encoder.encode(content);
  const objects: string[] = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>`,
    `<< /Length ${streamBytes.length} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  objects.forEach((obj, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xrefPos = pdf.length;
  pdf += 'xref\n';
  pdf += `0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  offsets.forEach(off => {
    pdf += `${off.toString().padStart(10, '0')} 00000 n \n`;
  });

  pdf += 'trailer\n';
  pdf += `<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefPos}\n%%EOF`;

  const blob = new Blob([pdf], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 100);
}

private escapePDFString(text: string): string {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\r/g, '')
    .replace(/\n/g, ' ')
    .replace(/\t/g, ' ');
}


//   downloadPDF(data: any[] | any) {
//   const filename = 'customers.pdf';
//   const items = Array.isArray(data) ? data : [data];
//   if (!items || items.length === 0) return;

//   const headers = ['name', 'email', 'phone', 'address', 'balance', 'status'];

//   const pageWidth = 612;
//   const pageHeight = 792;
//   const leftMargin = 50;
//   const topMargin = 750;
//   const columnWidths = [100, 120, 80, 120, 60, 60];
//   const rowHeight = 20;
//   const cellPadding = 3;

//   let y = topMargin;
//   let content = 'BT\n/F1 12 Tf\n';

//   // Header background
//   content += 'q\n0.9 0.9 0.9 rg\n';
//   content += `${leftMargin} ${y - rowHeight + 3} ${columnWidths.reduce((a, b) => a + b, 0)} ${rowHeight} re f\nQ\n`;

//   // Header text
//   let x = leftMargin;
//   headers.forEach((h, i) => {
//     content += `1 0 0 1 ${x + cellPadding} ${y - 14} Tm\n(${this.escapePDFString(h.toUpperCase())}) Tj\n`;
//     x += columnWidths[i];
//   });
//   y -= rowHeight;

//   // Data rows
//   content += '/F2 10 Tf\n';
//   items.forEach((item, idx) => {
//     // Alternate row background
//     if (idx % 2 === 0) {
//       content += 'q\n0.95 0.95 0.95 rg\n';
//       content += `${leftMargin} ${y - rowHeight + 3} ${columnWidths.reduce((a, b) => a + b, 0)} ${rowHeight} re f\nQ\n`;
//     }

//     x = leftMargin;
//     headers.forEach((h, i) => {
//       const val = item[h] != null ? String(item[h]) : '';
//       content += `1 0 0 1 ${x + cellPadding} ${y - 14} Tm\n(${this.escapePDFString(val)}) Tj\n`;
//       x += columnWidths[i];
//     });
//     y -= rowHeight;
//   });

//   content += 'ET\n'; // close text block

//   // Table borders
//   content += '0.5 w\n';
//   let tableWidth = columnWidths.reduce((a, b) => a + b, 0);
//   let tableHeight = topMargin - y;
//   // outer border
//   content += `${leftMargin} ${y} ${tableWidth} ${tableHeight} re S\n`;

//   // vertical lines
//   let vx = leftMargin;
//   columnWidths.forEach(w => {
//     vx += w;
//     content += `${vx} ${y} m ${vx} ${topMargin} l S\n`;
//   });

//   // horizontal lines
//   let rowY = topMargin;
//   for (let i = 0; i <= items.length; i++) {
//     content += `${leftMargin} ${rowY - rowHeight} m ${leftMargin + tableWidth} ${rowY - rowHeight} l S\n`;
//     rowY -= rowHeight;
//   }

//   // --- Build objects properly ---
//   const encoder = new TextEncoder();
//   const streamBytes = encoder.encode(content);
//   const objects: string[] = [
//     '<< /Type /Catalog /Pages 2 0 R >>',
//     '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
//     `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>`,
//     `<< /Length ${streamBytes.length} >>\nstream\n${content}\nendstream`,
//     '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
//     '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
//   ];

//   let pdf = '%PDF-1.4\n';
//   const offsets: number[] = [];
//   objects.forEach((obj, i) => {
//     offsets.push(pdf.length);
//     pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
//   });

//   const xrefPos = pdf.length;
//   pdf += 'xref\n';
//   pdf += `0 ${objects.length + 1}\n`;
//   pdf += '0000000000 65535 f \n';
//   offsets.forEach(off => {
//     pdf += `${off.toString().padStart(10, '0')} 00000 n \n`;
//   });

//   pdf += 'trailer\n';
//   pdf += `<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
//   pdf += `startxref\n${xrefPos}\n%%EOF`;

//   const blob = new Blob([pdf], { type: 'application/pdf' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = filename;
//   link.click();
//   setTimeout(() => URL.revokeObjectURL(link.href), 100);
// }

// private escapePDFString(text: string): string {
//   return String(text)
//     .replace(/\\/g, '\\\\')
//     .replace(/\(/g, '\\(')
//     .replace(/\)/g, '\\)')
//     .replace(/\r/g, '')
//     .replace(/\n/g, ' ')
//     .replace(/\t/g, ' ');
// }


  //good

// downloadPDF(data: any[] | any) {
//   const filename = 'customers.pdf';
//   const items = Array.isArray(data) ? data : [data];
//   if (!items || items.length === 0) return;

//   const headers = ['name', 'email', 'phone', 'address', 'balance', 'status'];

//   const pageWidth = 612;
//   const pageHeight = 792;
//   const leftMargin = 50;
//   const topMargin = 750;
//   const columnWidths = [100, 120, 80, 120, 60, 60];
//   const rowHeight = 20;
//   const cellPadding = 3;
//   let y = topMargin;
//   let content = '';

//   // Header row with bold font and gray background
//   content += '0.9 0.9 0.9 rg\n'; // light gray fill
//   content += `${leftMargin} ${y - rowHeight + 3} ${columnWidths.reduce((a, b) => a + b, 0)} ${rowHeight} re f\n`; // filled rect
//   content += '0 0 0 rg\n'; // reset text color to black
//   content += '/F1 12 Tf\n';
//   let x = leftMargin;
//   headers.forEach((h, i) => {
//     content += `1 0 0 1 ${x + cellPadding} ${y - 15} Tm\n`;
//     content += `(${this.escapePDFString(h.toUpperCase())}) Tj\n`;
//     x += columnWidths[i];
//   });
//   y -= rowHeight;

//   // Data rows with alternating background colors
//   content += '/F2 10 Tf\n';
//   items.forEach((item, idx) => {
//     if (y < 50) {
//       content += 'ET\nshowpage\nBT\n/F2 10 Tf\n';
//       y = pageHeight - 50;
//     }

//     // Alternate row color
//     if (idx % 2 === 0) {
//       content += '0.95 0.95 0.95 rg\n'; // very light gray
//       content += `${leftMargin} ${y - rowHeight + 3} ${columnWidths.reduce((a, b) => a + b, 0)} ${rowHeight} re f\n`;
//       content += '0 0 0 rg\n';
//     }

//     x = leftMargin;
//     headers.forEach((h, i) => {
//       const val = item[h] != null ? String(item[h]) : '';
//       content += `1 0 0 1 ${x + cellPadding} ${y - 15} Tm\n`;
//       content += `(${this.escapePDFString(val)}) Tj\n`;
//       x += columnWidths[i];
//     });
//     y -= rowHeight;
//   });

//   // Draw table borders
//   content += '0.3 w\n'; // line width
//   let tableHeight = topMargin - y;
//   x = leftMargin;
//   let tableWidth = columnWidths.reduce((a, b) => a + b, 0);
//   content += `${leftMargin} ${y} ${tableWidth} ${tableHeight} re S\n`; // outer table border

//   // Draw vertical lines
//   x = leftMargin;
//   columnWidths.forEach(w => {
//     x += w;
//     content += `${x} ${y} m ${x} ${topMargin} l S\n`;
//   });

//   // Draw horizontal lines
//   let rowY = topMargin;
//   content += `${leftMargin} ${rowY - rowHeight} m ${leftMargin + tableWidth} ${rowY - rowHeight} l S\n`; // header bottom
//   for (let i = 1; i <= items.length; i++) {
//     rowY -= rowHeight;
//     content += `${leftMargin} ${rowY} m ${leftMargin + tableWidth} ${rowY} l S\n`;
//   }

//   content += 'ET\n';

//   // PDF objects
//   const objects: string[] = [
//     '<< /Type /Catalog /Pages 2 0 R >>',
//     '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
//     `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>`,
//     `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
//     '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
//     '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
//   ];

//   let pdf = '%PDF-1.4\n';
//   const offsets: number[] = [];
//   objects.forEach((obj, i) => {
//     offsets.push(pdf.length);
//     pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
//   });

//   const xrefPos = pdf.length;
//   pdf += 'xref\n';
//   pdf += `0 ${objects.length + 1}\n`;
//   pdf += '0000000000 65535 f \n';
//   offsets.forEach(off => {
//     pdf += `${off.toString().padStart(10, '0')} 00000 n \n`;
//   });

//   pdf += 'trailer\n';
//   pdf += `<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
//   pdf += `startxref\n${xrefPos}\n%%EOF`;

//   const blob = new Blob([pdf], { type: 'application/pdf' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = filename;
//   link.click();
//   setTimeout(() => URL.revokeObjectURL(link.href), 100);
// }

// private escapePDFString(text: string): string {
//   return String(text)
//     .replace(/\\/g, '\\\\')
//     .replace(/\(/g, '\\(')
//     .replace(/\)/g, '\\)')
//     .replace(/\r/g, '')
//     .replace(/\n/g, ' ')
//     .replace(/\t/g, ' ');
// }



// Simple working version - replace your current PDF methods with this

// downloadPDF(data: any[] | any) {
//   const filename = 'customers.pdf';
//   const items = Array.isArray(data) ? data : [data];
//   if (!items || items.length === 0) return;

//   const headers = Object.keys(items[0]);
  
//   // Simple PDF content
//   let pdfContent = `%PDF-1.4
// 1 0 obj
// << /Type /Catalog /Pages 2 0 R >>
// endobj
// 2 0 obj
// << /Type /Pages /Kids [3 0 R] /Count 1 >>
// endobj
// 3 0 obj
// << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
// endobj
// 4 0 obj
// << /Length 200 >>
// stream
// BT
// /F1 12 Tf
// 50 750 Td
// (Customer List) Tj
// 0 -20 Td
// (Generated: ${new Date().toLocaleString()}) Tj
// 0 -40 Td
// `;

//   // Add headers
//   pdfContent += `(${headers.join('   ')}) Tj\n0 -20 Td\n`;

//   // Add data
//   items.forEach(item => {
//     const row = headers.map(h => item[h] ?? '').join('   ');
//     pdfContent += `(${this.escapePDFString(row)}) Tj\n0 -15 Td\n`;
//   });

//   pdfContent += `ET
// endstream
// endobj
// 5 0 obj
// << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
// endobj
// xref
// 0 6
// 0000000000 65535 f 
// 0000000009 00000 n 
// 0000000058 00000 n 
// 0000000115 00000 n 
// 0000000240 00000 n 
// 0000000384 00000 n 
// trailer
// << /Size 6 /Root 1 0 R >>
// startxref
// ${pdfContent.length - 100}
// %%EOF`;

//   const blob = new Blob([pdfContent], { type: 'application/pdf' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = filename;
//   link.click();
  
//   setTimeout(() => URL.revokeObjectURL(link.href), 100);
// }

// private escapePDFString(text: string): string {
//   return String(text).replace(/[\(\)\\]/g, '\\$&');
// }



  //download in excell format

  downloadCSV(data: any[] | any) {
    let filename = 'customers.csv';
  // Ensure we always work with an array
  const items = Array.isArray(data) ? data : [data];
  if (!items || items.length === 0) return;

  // Convert to CSV
  const header = Object.keys(items[0]).join(',');
  const rows = items.map(item =>
    Object.values(item).map(v => `"${v ?? ''}"`).join(',')
  );
  const csvContent = [header, ...rows].join('\n');

  // Trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.click();
}

//   downloadList() {
//   if (!this.customers || this.customers.length === 0) return;

//   // Convert customers to CSV
//   const header = Object.keys(this.customers[0]).join(',');  
//   const rows = this.customers.map(c => 
//     Object.values(c).map(v => `"${v ?? ''}"`).join(',')
//   );
//   const csvContent = [header, ...rows].join('\n');

//   // Trigger download
//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = 'customers.csv';
//   link.click();
// }

// downloadSingle(customer: Customer) {
//   if (!customer) return;

//   // Convert one customer to CSV
//   const header = Object.keys(customer).join(',');
//   const row = Object.values(customer).map(v => `"${v ?? ''}"`).join(',');
//   const csvContent = [header, row].join('\n');

//   // Trigger download
//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = `customer_${customer.id}.csv`;
//   link.click();
// }

}
