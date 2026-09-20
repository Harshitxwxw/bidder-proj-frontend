
import {getTenderBidders,getTenderRequirements,} from "./api";
import { analyzeBidder } from "./bidderAnalysisService";

const analyzeTender = async (tenderId,onProgress) => {

  const [bidders, requirements] =
    await Promise.all([
      getTenderBidders(tenderId),
      getTenderRequirements(tenderId),
    ]);

  const results = [];


  // 2. Analyze each bidder one by one
  for (let index = 0; index < bidders.length; index++) {

    const bidder = bidders[index];
    const result = await analyzeBidder(bidder.id,requirements,

      (progress) => {
        onProgress?.({
          bidderId: bidder.id,

          bidderName:
            bidder.companyName ||
            bidder.name,

          bidderIndex: index + 1,
          bidderTotal: bidders.length,

          ...progress,
        });
      }
    );

    results.push(result);
  }


  // 3. Sort bidders by compliance score
  results.sort((a, b) => {

    const scoreDifference =
      Number(b.complianceScore) -
      Number(a.complianceScore);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return (
      new Date(
        a.submittedDate ||
        a.submissionDate
      ) -
      new Date(b.submittedDate ||b.submissionDate)
    );
  });

  return results;
};


export {
  analyzeTender,
};