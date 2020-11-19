import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';

export const printDashboard = async ({ fileName, orientation }) => {
  const input = document.getElementById('pdfPreview');
  const canvas = await html2canvas(input);

  const leftMargin = 12.7;
  let topMargin = 12.7;

  let imgWidth = 184.6;
  let imgHeight = (canvas.height * imgWidth) / canvas.width;

  if (orientation === 'landscape') {
    topMargin /= 1.5;
    imgWidth = 271.6;
    imgHeight = (canvas.height * (imgWidth / 1.5)) / canvas.width;
  }

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF(orientation, 'mm', 'a4');

  pdf.addImage(imgData, 'JPEG', leftMargin, topMargin, imgWidth, imgHeight);
  addFooters(pdf, orientation);

  pdf.save(`${fileName}_${moment().format('YYYY-MM-DDTHHmmssZZ')}.pdf`);
};

const addFooters = (doc, orientation) => {
  const pageCount = doc.internal.getNumberOfPages();

  let bottomOfPage = 287;

  if (orientation === 'landscape') {
    bottomOfPage = 200;
  }

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);

  for (var i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text('Page ' + String(i) + ' of ' + String(pageCount), 12.7, bottomOfPage, { align: 'left' });
    doc.text(
      `${moment().format('MM/DD/YYYY hh:mm:ss A Z')}`,
      doc.internal.pageSize.width - 12.7,
      bottomOfPage,
      {
        align: 'right',
      },
    );
  }
};
