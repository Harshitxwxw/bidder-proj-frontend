
import { downloadDocument } from "./api";
import { renderPDFToImages } from "./pdfProcessor";

// Run PaddleOCR and get the extracted text/confidence
import {
  runPaddleOCR,
  getOCRText,
  getOCRConfidence,
} from "./paddleOCR";


// Check whether the document is a PDF
const isPDF = (document) => {
  const fileName = document.fileName || document.name || "";

  return (
    document.mimeType === "application/pdf" ||
    fileName.toLowerCase().endsWith(".pdf")
  );
};


// Analyze a normal image document
const analyzeImage = async (blob) => {
  const results = await runPaddleOCR(blob);

  return {
    text: getOCRText(results),
    confidence: getOCRConfidence(results),
    rawOCR: results,
  };
};


// Analyze a PDF document
const analyzePDF = async (blob) => {
  const pages = await renderPDFToImages(blob);

  let allResults = [];

  // Run OCR on every page
  for (const page of pages) {
    const results = await runPaddleOCR(page);
    allResults = [...allResults, ...results];
  }

  return {
    text: getOCRText(allResults),
    confidence: getOCRConfidence(allResults),
    rawOCR: allResults,
    pageCount: pages.length,
  };
};


// Analyze one document
const analyzeDocument = async (document) => {
  try {
    const blob = await downloadDocument(document.fileUrl);
    const result = isPDF(document)
      ? await analyzePDF(blob)
      : await analyzeImage(blob);

    // Return the OCR result
    return {
      documentId: document.id,
      documentType: document.documentType,
      fileName: document.fileName || document.name,

      text: result.text,
      confidence: result.confidence,

      pageCount: result.pageCount || 1,
      rawOCR: result.rawOCR,

      status: "processed",
    };

  } catch (error) {
    return {
      documentId: document.id,
      documentType: document.documentType,
      fileName: document.fileName || document.name,

      text: "",
      confidence: 0,

      status: "failed",
      error: error.message || "OCR failed",
    };
  }
};


// Analyze all documents belonging to a bidder
const analyzeDocuments = async (documents, onProgress) => {
  const results = [];

  for (let i = 0; i < documents.length; i++) {
    const result = await analyzeDocument(documents[i]);
    results.push(result);

    // Tell the UI about the current progress
    onProgress?.({
      current: i + 1,
      total: documents.length,
      document: documents[i],
      result,
    });
  }

  return results;
};


export {
  analyzeDocument,
  analyzeDocuments,
};