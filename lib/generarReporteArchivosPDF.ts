// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.vfs;

interface Archivo {
  id: string;
  nombre: string;
  respaldo: {
    fecha: string;
    descripcion: string;
    tiposRespaldo?: {
      nombre: string;
    } | null;
    persona?: {
      ci: string;
      nombres: string;
      paterno: string;
    } | null;
  } | null;
}

export function generarReporteArchivosPDF(archivos: Archivo[]) {
  const body = [
    [
      '#',
      'CI',
      'Nombre',
      'Descripción',
      'Tipo de archivo',
      'Fecha de subida',
      'Nombre del archivo'
    ],
    ...archivos.map((a, i) => [
      i + 1,
      a.respaldo?.persona?.ci ?? '---',
      `${a.respaldo?.persona?.nombres ?? ''} ${a.respaldo?.persona?.paterno ?? ''}`,
      a.respaldo?.descripcion ?? '---',
      a.respaldo?.tiposRespaldo?.nombre ?? '---',
      a.respaldo?.fecha
        ? new Date(a.respaldo.fecha).toLocaleDateString()
        : '---',
      a.nombre
    ]),
  ];

  const docDefinition = {
    content: [
      { text: 'REPORTE DE ARCHIVOS SUBIDOS', style: 'header' },
      {
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', '*', '*', '*', 'auto', '*'],
          body,
        },
        layout: 'lightHorizontalLines'
      },
    ],
    styles: {
      header: {
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 10],
        alignment: 'center'
      },
    },
    pageOrientation: 'landscape'
  };

  pdfMake.createPdf(docDefinition).download('reporte-archivos.pdf');
}
