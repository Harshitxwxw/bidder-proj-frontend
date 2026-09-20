// Normalize text so OCR text and database values can be compared
const normalize = (value) => {
  if (!value) {
    return "";
  }

  return String(value).toLowerCase().trim().replace(/\s+/g, " ").replace(/[^\w\s-]/g, "");
};


// Convert a date into YYYY-MM-DD format
const normalizeDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString().split("T")[0];
};


// Check whether a database value appears in OCR text
const textMatches = (ocrText, databaseValue) => {
  if (!ocrText || !databaseValue) {
    return false;
  }

  return normalize(ocrText).includes(
    normalize(databaseValue)
  );
};

// Check whether a date appears in OCR text
const dateMatches = (ocrText, databaseValue) => {
  if (!ocrText || !databaseValue) {
    return false;
  }
  const dbDate = normalizeDate(databaseValue);
  if (!dbDate) {
    return false;
  }

  const [year, month, day] = dbDate.split("-");

  return (
    ocrText.includes(year) &&
    (
      ocrText.includes(`${month}/${day}/${year}`) ||
      ocrText.includes(`${day}/${month}/${year}`) ||
      ocrText.includes(`${year}-${month}-${day}`)
    )
  );
};


const DEFAULT_RULES = {
  business_license: {
    weight: 20,
    fields: [
      {
        name: "companyName",
        databaseField: "companyName",
        type: "text",
      },
      {
        name: "registrationNumber",
        databaseField: "registrationNumber",
        type: "text",
      },
      {
        name: "licenseExpiry",
        databaseField: "licenseExpiry",
        type: "date",
      },
    ],
  },

  tax_clearance: {
    weight: 20,
    fields: [
      {
        name: "companyName",
        databaseField: "companyName",
        type: "text",
      },
      {
        name: "taxNumber",
        databaseField: "taxNumber",
        type: "text",
      },
    ],
  },

  iso_27001: {
    weight: 25,
    fields: [
      {
        name: "companyName",
        databaseField: "companyName",
        type: "text",
      },
      {
        name: "certificateNumber",
        databaseField: "iso27001CertificateNumber",
        type: "text",
      },
    ],
  },

  audited_financials: {
    weight: 20,
    fields: [
      {
        name: "companyName",
        databaseField: "companyName",
        type: "text",
      },
    ],
  },

  bank_guarantee: {
    weight: 15,
    fields: [
      {
        name: "companyName",
        databaseField: "companyName",
        type: "text",
      },
      {
        name: "guaranteeNumber",
        databaseField: "bankGuaranteeNumber",
        type: "text",
      },
    ],
  },
};


// Combine backend requirements with the default rules
const buildRule = (documentType, requirements) => {
  const backendRule = requirements?.find(
    (item) => item.documentType === documentType
  );

  const defaultRule = DEFAULT_RULES[documentType];

  if (!defaultRule) {
    return null;
  }

  if (backendRule) {
    return {
      ...defaultRule,
      weight: backendRule.weight ?? defaultRule.weight,
      required: backendRule.required ?? true,
    };
  }

  return {
    ...defaultRule,
    required: true,
  };
};


// Check one document against the bidder's database information
const checkDocument = ({
  document,
  bidder,
  ocrResult,
  requirements,
}) => {
  const rule = buildRule(
    document.documentType,
    requirements
  );

  if (!rule) {
    return {
      documentId: document.id,
      documentType: document.documentType,
      status: "unknown",
      score: 0,
      weight: 0,
      fields: {},
    };
  }


  // OCR failed, so the document cannot be verified
  if (ocrResult.status === "failed") {
    return {
      documentId: document.id,
      documentType: document.documentType,
      status: "ocr_failed",
      score: 0,
      weight: rule.weight,
      fields: {},
      ocrConfidence: 0,
    };
  }


  const fields = {};
  let matchedFields = 0;


  for (const field of rule.fields || []) {
    const databaseValue =
      bidder[field.databaseField];

    let matched = false;

    if (field.type === "date") {
      matched = dateMatches(
        ocrResult.text,
        databaseValue
      );
    } else {
      matched = textMatches(
        ocrResult.text,
        databaseValue
      );
    }

    fields[field.name] = {
      matched,
      databaseValue,
      ocrText: ocrResult.text,
    };

    if (matched) {
      matchedFields++;
    }
  }


  // Calculate how much of this document's weight was earned
  const totalFields = rule.fields?.length || 0;

  const percentage =
    totalFields === 0 ? 0 : matchedFields / totalFields;

  const score = Math.round(
    rule.weight * percentage
  );


  // Determine document status
  let status = "not_matched";

  if (matchedFields === totalFields && totalFields > 0) {
    status = "matched";
  } else if (matchedFields > 0) {
    status = "partial";
  }

  return {
    documentId: document.id,
    documentType: document.documentType,
    status,
    score,
    weight: rule.weight,
    required: rule.required,
    fields,
    ocrConfidence: ocrResult.confidence,
  };
};


// Calculate the final bidder compliance percentage
const calculateComplianceScore = (results) => {
  const totalWeight = results.reduce((sum, result) =>
      sum + Number(result.weight || 0),
    0
  );

  const totalScore = results.reduce(
    (sum, result) =>
      sum + Number(result.score || 0),
    0
  );

  if (!totalWeight) {
    return 0;
  }

  return Math.round(
    (totalScore / totalWeight) * 100
  );
};


export {
  DEFAULT_RULES,
  checkDocument,
  calculateComplianceScore,
};