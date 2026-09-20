import { PaddleOCR } from "@paddleocr/paddleocr-js";

let ocrInstance = null;

const initializePaddleOCR = async () => {
  if (ocrInstance) {
    return ocrInstance;
  }

  ocrInstance = await PaddleOCR.create({
    lang: "en",
    ocrVersion: "PP-OCRv5",
    worker: true,
    ortOptions: {
      backend: "wasm",
      wasmPaths:
        "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/",
      numThreads: 2,
      simd: true,
    },
  });

  return ocrInstance;
};

const runPaddleOCR = async (input) => {
  const ocr = await initializePaddleOCR();

  const results = await ocr.predict(input);

  return results;
};

const getOCRText = (results) => {
  if (!Array.isArray(results)) {
    return "";
  }

  return results
    .flatMap((result) => result?.items || [])
    .map((item) => item.text || "")
    .filter(Boolean)
    .join("\n");
};

const getOCRConfidence = (results) => {
  const items =
    results?.flatMap(
      (result) => result?.items || []
    ) || [];

  if (!items.length) {
    return 0;
  }

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.score || 0),
    0
  );

  return total / items.length;
};

const disposePaddleOCR = () => {
  if (ocrInstance) {
    ocrInstance.dispose();
    ocrInstance = null;
  }
};

export {
  initializePaddleOCR,
  runPaddleOCR,
  getOCRText,
  getOCRConfidence,
  disposePaddleOCR,
};