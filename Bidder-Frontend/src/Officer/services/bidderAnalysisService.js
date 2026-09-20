import {getBidder,getBidderDocuments,} from "./api";
import { analyzeDocuments } from "./documentAnalyzer";

import {checkDocument,calculateComplianceScore,} from "./complianceService";


const analyzeBidder = async (bidderId,requirements,onProgress) => {
  const bidder = await getBidder(bidderId);
  const documents = await getBidderDocuments(bidderId);
  const ocrResults = await analyzeDocuments(documents,onProgress);

  const complianceResults = ocrResults.map((ocrResult) => {

    const document = documents.find(
      (item) => item.id === ocrResult.documentId
    );

    return checkDocument({document,bidder,ocrResult,requirements,});
  });

  // 5. Calculate the final compliance score
  const complianceScore =
    calculateComplianceScore(complianceResults);


  return {...bidder,
    complianceScore,
    documents: complianceResults,
    ocrResults,
    analysisStatus: "completed",
  };
};


export {
  analyzeBidder,
};