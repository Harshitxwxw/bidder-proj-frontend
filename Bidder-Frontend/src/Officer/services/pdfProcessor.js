import * as pdfjsLib from "pdfjs-dist";

import pdfWorker from
  "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  pdfWorker;

const renderPDFToImages = async (blob) => {
  const arrayBuffer =
    await blob.arrayBuffer();

  const pdf =
    await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise;

  const images = [];

  for (
    let pageNumber = 1;
    pageNumber <= pdf.numPages;
    pageNumber++
  ) {
    const page =
      await pdf.getPage(pageNumber);

    const viewport =
      page.getViewport({
        scale: 2,
      });

    const canvas =
      document.createElement("canvas");

    const context =
      canvas.getContext("2d");

    canvas.width =
      viewport.width;

    canvas.height =
      viewport.height;

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    images.push(canvas);
  }

  return images;
};

export {
  renderPDFToImages,
};