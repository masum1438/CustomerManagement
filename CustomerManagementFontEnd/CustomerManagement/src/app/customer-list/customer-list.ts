import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';
import { Router, RouterModule } from '@angular/router';
import { Customer } from '../customer.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-customer-list',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerList implements OnInit {
customers: Customer[] = [];
query = '';
constructor(private service:CustomerService,
  private router:Router,
  private documentService:DocumentService)
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
  if(confirm('Are you sure you want to delete it?')){
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

//status bgcolor used

// downloadPDF(data: any[] | any) {
//   const filename = 'customers.pdf';
//   const items = Array.isArray(data) ? data : [data];
//   if (!items || items.length === 0) return;

//   const headers = ['name', 'email', 'phone', 'address', 'balance', 'status'];

//   const pageWidth = 612;
//   const pageHeight = 792;
//   const leftMargin = 30;
//   const topMargin = 720;
//   const columnWidths = [100, 120, 80, 120, 90, 60]; 
//   const rowHeight = 22;
//   const cellPadding = 4;

//   let y = topMargin;
//   let content = 'BT\n';

//   // --- Document Title ---
//   const title = "Customer List";
//   const titleX = pageWidth / 2 - (title.length * 4);
//   const titleY = 760;
//   content += '/F1 18 Tf\n0 0 0 rg\n';
//   content += `1 0 0 1 ${titleX} ${titleY} Tm\n(${this.escapePDFString(title)}) Tj\n`;

//   // --- Table Header ---
//   content += '/F1 12 Tf\n';
//   content += 'q\n0 0 0 rg\n'; // black background
//   content += `${leftMargin} ${y - rowHeight} ${columnWidths.reduce((a, b) => a + b, 0)} ${rowHeight} re f\nQ\n`;

//   let x = leftMargin;
//   headers.forEach((h, i) => {
//     content += '1 1 1 rg\n'; // white text
//     content += `1 0 0 1 ${x + cellPadding} ${y - 15} Tm\n(${this.escapePDFString(h.toUpperCase())}) Tj\n`;
//     x += columnWidths[i];
//   });
//   y -= rowHeight;

//   // --- Data Rows ---
//   content += '/F2 10 Tf\n';
//   items.forEach((item, idx) => {
//     // Alternate row background
//     if (idx % 2 === 0) {
//       content += 'q\n0.96 0.96 0.96 rg\n';
//       content += `${leftMargin} ${y - rowHeight} ${columnWidths.reduce((a, b) => a + b, 0)} ${rowHeight} re f\nQ\n`;
//     }

//     x = leftMargin;
//     headers.forEach((h, i) => {
//       let val = item[h] != null ? String(item[h]) : '';

//       // --- Status Cell Coloring ---
//       if (h === 'status') {
//         if (val.toLowerCase() === 'active') {
//           content += 'q\n0.7 1 0.7 rg\n'; // light green
//           content += `${x} ${y - rowHeight} ${columnWidths[i]} ${rowHeight} re f\nQ\n`;
//           content += '0 0.4 0 rg\n'; // dark green text
//         } else if (val.toLowerCase() === 'inactive') {
//           content += 'q\n1 0.7 0.7 rg\n'; // light red
//           content += `${x} ${y - rowHeight} ${columnWidths[i]} ${rowHeight} re f\nQ\n`;
//           content += '0.6 0 0 rg\n'; // dark red text
//         } else {
//           content += '0 0 0 rg\n'; // default black text
//         }
//       } else {
//         content += '0 0 0 rg\n'; // normal black text
//       }

//       // Draw text
//       content += `1 0 0 1 ${x + cellPadding} ${y - 14} Tm\n(${this.escapePDFString(val)}) Tj\n`;
//       x += columnWidths[i];
//     });
//     y -= rowHeight;
//   });

//   content += 'ET\n';

//   // --- Table Borders ---
//   content += '0.5 w\n0 0 0 RG\n';
//   let tableWidth = columnWidths.reduce((a, b) => a + b, 0);
//   let tableHeight = topMargin - y;
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

//   // --- Build objects ---
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


//  downloadCSV(data: any[] | any){
//   this.downloadCSV(data:any[]|any , "customers")
//  }

  // ✅ Download PDF of either single or all
  singlePDFDownload(data?: Customer | Customer[]) {
    const items = data ?? this.customers;
    this.documentService.singlePDFDownload(items, `'Customer'`);
  }

  downloadPDF(data?: Customer | Customer[]) {
    const items = data ?? this.customers;
    this.documentService.downloadPDF(items, 'customers');
  }

  //  Download CSV of either single or all
  downloadXLS(data?: Customer | Customer[]) {
    const items = data ?? this.customers;
    this.documentService.downloadXLS(items, 'customers');
  }



}
