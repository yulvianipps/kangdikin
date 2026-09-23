export function downloadCSV(data: Record<string, unknown>[], filename: string) {
  if (!data || !data.length) return;

  const headers = Object.keys(data[0]);
  const csvRows: string[] = [];

  // Header row
  csvRows.push(headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','));

  // Data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];
      if (val === null || val === undefined) return '""';
      const escaped = String(val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = '\uFEFF' + csvRows.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadExcel(data: Record<string, unknown>[], filename: string) {
  if (!data || !data.length) return;

  // Generate XML-based Spreadsheet 2003 which opens cleanly in Excel, Calc, and Numbers
  const headers = Object.keys(data[0]);

  let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#059669" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Default">
   <Alignment ss:Vertical="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Laporan KANG DIKIN">
  <Table>
   <Row>`;

  headers.forEach((h) => {
    xml += `<Cell ss:StyleID="Header"><Data ss:Type="String">${h}</Data></Cell>`;
  });
  xml += `</Row>`;

  data.forEach((row) => {
    xml += `<Row>`;
    headers.forEach((header) => {
      const val = row[header];
      const isNum = typeof val === 'number';
      const type = isNum ? 'Number' : 'String';
      const cleanVal = val === null || val === undefined ? '' : String(val);
      xml += `<Cell ss:StyleID="Default"><Data ss:Type="${type}">${cleanVal}</Data></Cell>`;
    });
    xml += `</Row>`;
  });

  xml += `  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.xls') ? filename : `${filename}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printFormattedReport(title: string, subtitle: string, headers: string[], rows: (string | number)[][]) {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; color: #1c1917; }
          .header { border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
          .title { font-size: 20px; font-weight: bold; color: #065f46; margin: 0; }
          .subtitle { font-size: 13px; color: #57534e; margin-top: 4px; }
          .badge { background: #dcfce7; color: #166534; font-size: 11px; font-weight: bold; padding: 4px 8px; border-radius: 4px; border: 1px solid #86efac; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
          th { background: #f5f5f4; color: #292524; font-weight: 600; text-align: left; padding: 8px 10px; border: 1px solid #e7e5e4; }
          td { padding: 8px 10px; border: 1px solid #e7e5e4; }
          tr:nth-child(even) { background-color: #fafaf9; }
          .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; color: #78716c; }
          .signature-box { text-align: center; width: 200px; }
          .sig-line { margin-top: 60px; border-top: 1px solid #a8a29e; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">KANG DIKIN</h1>
            <div class="subtitle">Kelola Lingkungan, Sadar Iklim dan Kesejahteraan Terintegrasi</div>
            <div style="font-weight: 600; margin-top: 8px; font-size: 14px; color: #1c1917;">${title}</div>
            <div style="font-size: 12px; color: #78716c;">${subtitle}</div>
          </div>
          <div style="text-align: right;">
            <span class="badge">DANA BERSAMA</span>
            <div style="font-size: 11px; color: #a8a29e; margin-top: 6px;">Dicetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              ${headers.map((h) => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => `
              <tr>
                ${row.map((cell) => `<td>${cell}</td>`).join('')}
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="footer">
          <div>* Data laporan sah sebagai instrumen transparansi publik KANG DIKIN</div>
          <div class="signature-box">
            <div>Pengelola Program</div>
            <div class="sig-line">KANG DIKIN Terintegrasi</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
