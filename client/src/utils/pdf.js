import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';

export const printDashboard = async ({ fileName }) => {
  const dashboard = document.getElementById('pdfPreview');
  const canvas = await html2canvas(dashboard);

  // Create PDF
  const pdf = new jsPDF('p', 'pt', 'letter');
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(8);

  // Create references
  const dWidth = 900;
  const dHeight = 980;
  const scale = 1.65;
  const margin = 36;

  for (let i = 0; i <= dashboard.clientHeight / (dHeight * scale); i++) {
    const sX = 0;
    const sY = dHeight * scale * i; // start dHeight pixels down for every new page
    const sWidth = dashboard.clientWidth;
    const sHeight = dHeight * scale;

    const onePageCanvas = document.createElement('canvas');
    onePageCanvas.setAttribute('width', sWidth);
    onePageCanvas.setAttribute('height', sHeight);

    const ctx = onePageCanvas.getContext('2d');
    ctx.drawImage(canvas, sX, sY, sWidth, sHeight, 0, 0, dWidth, dHeight);

    const canvasDataURL = onePageCanvas.toDataURL('image/png', 1.0);

    if (i > 0) {
      pdf.addPage('letter', 'p');
      pdf.setPage(i + 1);
    }

    pdf.addImage(canvasDataURL, 'PNG', margin, margin, sWidth * 0.6, sHeight * 0.7);

    const rightOfPage = pdf.internal.pageSize.width - margin;
    const bottomOfPage = pdf.internal.pageSize.height - margin;

    pdf.text('Page ' + String(i + 1), 36, bottomOfPage, { align: 'left' });
    pdf.text(moment().format('MM/DD/YYYY hh:mm:ss A Z'), rightOfPage, bottomOfPage, { align: 'right' });
  }

  pdf.save(`${fileName}_${moment().format('YYYYMMDDTHHmmssZZ')}.pdf`);
};
