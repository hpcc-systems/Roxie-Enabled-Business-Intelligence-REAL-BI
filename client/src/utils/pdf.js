import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';

export const printDashboard = async ({ fileName, orientation }) => {
  const input = document.getElementById('pdfPreview');
  const canvas = await html2canvas(input);
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF(orientation, 'in', 'letter');

  const leftMargin = 0.5;
  const topMargin = 0.5;

  let imgWidth = 7.5;
  let imgHeight = (canvas.height * imgWidth) / canvas.width;

  if (orientation === 'landscape') {
    imgWidth = 10;
    imgHeight = (canvas.height * (imgWidth / 1.5)) / canvas.width;
  }

  pdf.addImage(imgData, 'JPEG', leftMargin, topMargin, imgWidth, imgHeight);
  addFooters(pdf, orientation);

  pdf.save(`${fileName}_${moment().format('YYYYMMDDTHHmmssZZ')}.pdf`);
};

const addFooters = (doc, orientation) => {
  const pageCount = doc.internal.getNumberOfPages();

  let bottomOfPage = 10.5;

  if (orientation === 'landscape') {
    bottomOfPage = 7.5;
  }

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);

  for (var i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text('Page ' + String(i) + ' of ' + String(pageCount), 0.5, bottomOfPage, { align: 'left' });
    doc.text(
      `${moment().format('MM/DD/YYYY hh:mm:ss A Z')}`,
      doc.internal.pageSize.width - 0.5,
      bottomOfPage,
      {
        align: 'right',
      },
    );
  }
};
