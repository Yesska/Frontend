import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Export visible element to PDF
export async function exportElementToPdf(element, filename = 'biblioteca.pdf') {
    if (!element) throw new Error('Elemento no encontrado para exportar');

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // calcular proporciones
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth - 20; // margen 10mm
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let position = 10;
    if (imgHeight <= pageHeight - 20) {
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    } else {
        // Si la imagen excede una página, dividir en secciones
        let remainingHeight = imgHeight;
        let sourceY = 0;
        const canvasPageHeight = Math.floor((canvas.height * (imgWidth / canvas.width)));

        while (remainingHeight > 0) {
            const canvasPage = document.createElement('canvas');
            canvasPage.width = canvas.width;
            canvasPage.height = Math.min(canvas.height - sourceY, Math.floor(canvasPageHeight * (canvas.width / imgWidth)));
            const ctx = canvasPage.getContext('2d');
            ctx.drawImage(canvas, 0, sourceY, canvasPage.width, canvasPage.height, 0, 0, canvasPage.width, canvasPage.height);

            const imgPageData = canvasPage.toDataURL('image/png');
            const imgPageProps = pdf.getImageProperties(imgPageData);
            const imgPageHeightMM = (imgPageProps.height * imgWidth) / imgPageProps.width;

            pdf.addImage(imgPageData, 'PNG', 10, position, imgWidth, imgPageHeightMM);

            remainingHeight -= canvasPage.height;
            sourceY += canvasPage.height;

            if (remainingHeight > 0) pdf.addPage();
        }
    }

    pdf.save(filename);
}
