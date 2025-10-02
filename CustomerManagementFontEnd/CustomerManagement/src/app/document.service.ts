import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  //single pdf download


singlePDFDownload(record: any, filename: string) {
  if (!record || typeof record !== "object") return;

  // --- Page setup ---
  const pageWidth = 612;
  const pageHeight = 792;
  const leftMargin = 40;
  let y = pageHeight - 80;

  let content = "";

  // --- Title ---
  const title = filename + " Details";
  const titleX = pageWidth / 2 - (title.length * 5);
  content += "BT\n";
  content += "/F1 16 Tf\n";
  content += "0 0 0 rg\n";
  content += `1 0 0 1 ${titleX} ${y} Tm\n`;
  content += `(${this.escapePDFString2(title)}) Tj\n`;
  content += "ET\n";

  y -= 40;

  // --- Other fields dynamically ---
  Object.keys(record).forEach(key => {
    const value = record[key] ?? "";

    const fontSize = 11;
    const labelText = this.formatHeaderLabel2(key) + " : ";

    // Approx width per char in Helvetica ~0.5 * fontSize
    const labelWidth = labelText.length * (fontSize * 0.5);

    // Label
    content += "BT\n";
    content += `/F1 ${fontSize} Tf\n`;
    content += "0 0 0 rg\n";
    content += `1 0 0 1 ${leftMargin} ${y} Tm\n`;
    content += `(${this.escapePDFString2(labelText)}) Tj\n`;
    content += "ET\n";

    // Value (placed after label dynamically)
    content += "BT\n";
    content += `/F1 ${fontSize} Tf\n`;
    content += "0 0 0 rg\n";
    content += `1 0 0 1 ${leftMargin + labelWidth + 5} ${y} Tm\n`;
    content += `(${this.escapePDFString2(String(value))}) Tj\n`;
    content += "ET\n";

    y -= 22;
  });

  // --- Build PDF ---
  const pdf =
    "%PDF-1.4\n" +
    "1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj\n" +
    "2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj\n" +
    "3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 " +
    pageWidth +
    " " +
    pageHeight +
    "] /Contents 4 0 R /Resources << /Font <</F1 5 0 R>> >> >> endobj\n" +
    "4 0 obj <</Length " +
    content.length +
    ">> stream\n" +
    content +
    "endstream endobj\n" +
    "5 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj\n" +
    "xref\n0 6\n0000000000 65535 f \n" +
    "trailer <</Size 6 /Root 1 0 R>>\nstartxref\n" +
    (content.length + 300) +
    "\n%%EOF";

  const blob = new Blob([pdf], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

private escapePDFString2(str: any): string {
  if (str === null || str === undefined) {
    return "";
  }
  return String(str).replace(/([()\\])/g, "\\$1");
}

private formatHeaderLabel2(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}






  // --- PDF Download ---

  

downloadPDF(
  data: any[] | any,
  filename: string,
  headers?: string[] | { key: string; label: string }[]
) {
  const items = Array.isArray(data) ? data : [data];
  if (!items || items.length === 0) return;

  // --- Dynamic header configuration ---
  let headerConfig: { key: string; label: string }[] = [];
  if (headers && Array.isArray(headers)) {
    if (typeof headers[0] === "string") {
      headerConfig = (headers as string[]).map(header => ({
        key: header,
        label: this.formatHeaderLabel(header)
      }));
    } else {
      headerConfig = headers as { key: string; label: string }[];
    }
  } else {
    const firstItem = items[0];
    headerConfig = Object.keys(firstItem).map(key => ({
      key: key,
      label: this.formatHeaderLabel(key)
    }));
  }

  // --- Page setup ---
  const pageWidth = 612;
  const pageHeight = 792;
  const leftMargin = 30;
  const topMargin = 720;

  const columnWidths = this.calculateColumnWidthsStandard(
    headerConfig,
    items,
    pageWidth - leftMargin * 2
  );

  const baseRowHeight = 22;
  const cellPadding = 4;

  let y = topMargin;
  let content = "";

  // --- Title ---
  const title = filename.replace(".pdf", "") || "Data Export";
  const titleX = pageWidth / 2 - (title.length * 5);
  const titleY = 760;
  content += "BT\n";
  content += "/F1 18 Tf\n";
  content += "0 0 0 rg\n";
  content += `1 0 0 1 ${titleX} ${titleY} Tm\n`;
  content += `(${this.escapePDFString(title)}) Tj\n`;
  content += "ET\n";

  // --- Header background ---
  content += "q\n";
  content += "0 0 0 rg\n"; // black background
  content += `${leftMargin} ${y - baseRowHeight} ${columnWidths.reduce(
    (a, b) => a + b,
    0
  )} ${baseRowHeight} re f\n`;
  content += "Q\n";

  // --- Header text ---
  content += "BT\n";
  content += "/F1 11 Tf\n";
  content += "1 1 1 rg\n"; // white text

  let x = leftMargin;
  headerConfig.forEach((header, i) => {
    const headerText = this.wrapText(
      header.label.toUpperCase(),
      columnWidths[i] - cellPadding * 2,
      11
    )[0];
    content += `1 0 0 1 ${x + cellPadding} ${y - 15} Tm\n`;
    content += `(${this.escapePDFString(headerText)}) Tj\n`;
    x += columnWidths[i];
  });
  content += "ET\n";
  y -= baseRowHeight;

  // --- Data rows ---
  items.forEach((item, idx) => {
    // Wrap text for each column
    const rowLines = headerConfig.map((header, i) => {
      const val = item[header.key] != null ? String(item[header.key]) : "";
      return this.wrapText(val, columnWidths[i] - cellPadding * 2, 9);
    });

    const maxLinesInRow = Math.max(...rowLines.map(lines => lines.length));
    const rowHeight = baseRowHeight * maxLinesInRow;

    // Alternate background
    if (idx % 2 === 0) {
      content += "q\n";
      content += "0.95 0.95 0.95 rg\n";
      content += `${leftMargin} ${y - rowHeight} ${columnWidths.reduce(
        (a, b) => a + b,
        0
      )} ${rowHeight} re f\n`;
      content += "Q\n";
    }

    content += "BT\n";
    content += "/F2 9 Tf\n";
    content += "0 0 0 rg\n";

    // Print each wrapped line
    x = leftMargin;
    headerConfig.forEach((header, i) => {
      const wrappedLines = rowLines[i];
      wrappedLines.forEach((line, lineIndex) => {
        const lineY = y - 14 - lineIndex * baseRowHeight;
        content += `1 0 0 1 ${x + cellPadding} ${lineY} Tm\n`;
        content += `(${this.escapePDFString(line)}) Tj\n`;
      });
      x += columnWidths[i];
    });

    content += "ET\n";
    y -= rowHeight;
  });

  // --- Table borders ---
  content += "0.5 w\n";
  content += "0 0 0 RG\n";
  const tableWidth = columnWidths.reduce((a, b) => a + b, 0);
  const tableHeight = topMargin - y;
  content += `${leftMargin} ${y} ${tableWidth} ${tableHeight} re S\n`;

  // Vertical lines
  let vx = leftMargin;
  columnWidths.forEach(w => {
    vx += w;
    content += `${vx} ${y} m ${vx} ${topMargin} l S\n`;
  });

  // Horizontal lines
  this.drawHorizontalLines(
    content,
    items,
    headerConfig,
    columnWidths,
    leftMargin,
    topMargin,
    baseRowHeight,
    y
  );

  // --- PDF assembly ---
  const encoder = new TextEncoder();
  const streamBytes = encoder.encode(content);
  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>`,
    `<< /Length ${streamBytes.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((obj, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xrefPos = pdf.length;
  pdf += "xref\n";
  pdf += `0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.forEach(off => {
    pdf += `${off.toString().padStart(10, "0")} 00000 n \n`;
  });

  pdf += "trailer\n";
  pdf += `<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefPos}\n%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 100);
}

// --- Helpers ---
private escapePDFString(text: string): string {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\r/g, "")
    .replace(/\n/g, " ")
    .replace(/\t/g, " ");
}

private formatHeaderLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase())
    .trim();
}

private calculateColumnWidthsStandard(
  headers: { key: string; label: string }[],
  items: any[],
  availableWidth: number
): number[] {
  const minWidth = 70;
  const wideExtra = 50;
  let widths = headers.map(h => {
    let base = minWidth;
    if (["email", "address", "description"].some(w =>
      h.key.toLowerCase().includes(w)
    )) {
      base += wideExtra;
    }
    return base;
  });

  let total = widths.reduce((a, b) => a + b, 0);

  if (total < availableWidth) {
    const extra = Math.floor((availableWidth - total) / headers.length);
    widths = widths.map(w => w + extra);
  } else if (total > availableWidth) {
    const scale = availableWidth / total;
    widths = widths.map(w => Math.floor(w * scale));
  }

  return widths;
}

private wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  if (!text) return [""];
  const avgCharWidth = fontSize * 0.55;
  const maxCharsPerLine = Math.floor(maxWidth / avgCharWidth);

  if (text.length <= maxCharsPerLine) return [text];

  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if (currentLine.length + word.length + 1 <= maxCharsPerLine) {
      currentLine += (currentLine ? " " : "") + word;
    } else {
      if (currentLine) lines.push(currentLine);
      if (word.length > maxCharsPerLine) {
        const broken = this.breakLongWord(word, maxCharsPerLine);
        lines.push(...broken);
        currentLine = "";
      } else {
        currentLine = word;
      }
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines;
}

private breakLongWord(word: string, maxChars: number): string[] {
  const parts: string[] = [];
  for (let i = 0; i < word.length; i += maxChars) {
    parts.push(word.substring(i, i + maxChars));
  }
  return parts;
}

private drawHorizontalLines(
  content: string,
  items: any[],
  headers: any[],
  columnWidths: number[],
  leftMargin: number,
  topMargin: number,
  baseRowHeight: number,
  currentY: number
) {
  let rowY = topMargin;
  const tableWidth = columnWidths.reduce((a, b) => a + b, 0);

  // Header line
  content += `${leftMargin} ${rowY - baseRowHeight} m ${
    leftMargin + tableWidth
  } ${rowY - baseRowHeight} l S\n`;
  rowY -= baseRowHeight;

  // Row lines
  items.forEach(item => {
    const rowLines = headers.map((header, i) => {
      const val = item[header.key] != null ? String(item[header.key]) : "";
      return this.wrapText(val, columnWidths[i] - 8, 9);
    });
    const maxLines = Math.max(...rowLines.map(lines => lines.length));
    const rowHeight = baseRowHeight * maxLines;

    content += `${leftMargin} ${rowY - rowHeight} m ${
      leftMargin + tableWidth
    } ${rowY - rowHeight} l S\n`;
    rowY -= rowHeight;
  });
}


  //excell file download

downloadXLS(data: any[] | any, filename: string) {
    const items = Array.isArray(data) ? data : [data];
    if (!items || items.length === 0) return;

    // Create Excel XML format (SpreadsheetML)
    let xmlContent = '<?xml version="1.0"?>\n';
    xmlContent += '<?mso-application progid="Excel.Sheet"?>\n';
    xmlContent += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
    xmlContent += ' xmlns:o="urn:schemas-microsoft-com:office:office"\n';
    xmlContent += ' xmlns:x="urn:schemas-microsoft-com:office:excel"\n';
    xmlContent += ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\n';
    xmlContent += ' xmlns:html="http://www.w3.org/TR/REC-html40">\n';
    
    // Styles
    xmlContent += '<Styles>\n';
    xmlContent += '  <Style ss:ID="Default" ss:Name="Normal">\n';
    xmlContent += '    <Alignment ss:Vertical="Bottom"/>\n';
    xmlContent += '  </Style>\n';
    xmlContent += '  <Style ss:ID="Header">\n';
    xmlContent += '    <Font ss:Bold="1" ss:Color="#FFFFFF"/>\n';
    xmlContent += '    <Interior ss:Color="#2E86AB" ss:Pattern="Solid"/>\n';
    xmlContent += '    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>\n';
    xmlContent += '  </Style>\n';
    xmlContent += '  <Style ss:ID="EvenRow">\n';
    xmlContent += '    <Interior ss:Color="#F8F9FA" ss:Pattern="Solid"/>\n';
    xmlContent += '  </Style>\n';
    xmlContent += '  <Style ss:ID="OddRow">\n';
    xmlContent += '    <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>\n';
    xmlContent += '  </Style>\n';
    xmlContent += '</Styles>\n';

    xmlContent += '<Worksheet ss:Name="Sheet1">\n';
    xmlContent += '<Table>\n';

    // Headers
    const headers = Object.keys(items[0]);
    xmlContent += '<Row>\n';
    headers.forEach(header => {
        xmlContent += `  <Cell ss:StyleID="Header"><Data ss:Type="String">${this.escapeExcelXML(header)}</Data></Cell>\n`;
    });
    xmlContent += '</Row>\n';

    // Data rows
    items.forEach((item, index) => {
        const rowStyle = index % 2 === 0 ? 'EvenRow' : 'OddRow';
        xmlContent += `<Row>\n`;
        headers.forEach(header => {
            let value = item[header] ?? '';
            let dataType = this.getExcelDataType(value);

            // Format dates as YYYY-MM-DD
            if (dataType === 'Date') {
                value = this.formatDate(value);
                dataType = 'String'; // export as string to avoid 12:00 AM
            }

            xmlContent += `  <Cell ss:StyleID="${rowStyle}"><Data ss:Type="${dataType}">${this.escapeExcelXML(String(value))}</Data></Cell>\n`;
        });
        xmlContent += `</Row>\n`;
    });

    xmlContent += '</Table>\n';
    xmlContent += '</Worksheet>\n';
    xmlContent += '</Workbook>';

    // Create and download the file
    const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename.endsWith('.xls') ? filename : `${filename}.xls`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
}

private escapeExcelXML(text: string): string {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
        .replace(/\r/g, '')
        .replace(/\n/g, '&#10;')
        .replace(/\t/g, ' ');
}

private getExcelDataType(value: any): string {
    if (value === null || value === undefined) return 'String';

    const strValue = String(value);

    // Check if it's a number
    if (!isNaN(Number(value)) && strValue.trim() !== '') {
        return 'Number';
    }

    // Check if it's a valid date
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
        return 'Date'; // mark as date but we’ll export as string
    }

    return 'String';
}

private formatDate(value: any): string {
    const date = new Date(value);
    if (isNaN(date.getTime())) return String(value);

    // Return standard YYYY-MM-DD
    return date.toISOString().split("T")[0];
}



}

