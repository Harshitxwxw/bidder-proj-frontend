const KEYS = {
  wishlist: "procurex_bidder_wishlist",
  applications: "procurex_bidder_applications",
  uploadedDocuments: "procurex_bidder_uploaded_documents",
  acknowledged: "procurex_bidder_acknowledged_tenders",
};

const read = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const getWishlist = () => read(KEYS.wishlist, []);
export const isWishlisted = (tenderId) => getWishlist().includes(tenderId);
export const toggleWishlist = (tenderId) => {
  const current = getWishlist();
  const next = current.includes(tenderId)
    ? current.filter((id) => id !== tenderId)
    : [...current, tenderId];
  write(KEYS.wishlist, next);
  return next;
};

export const getApplications = () => read(KEYS.applications, []);
export const getApplication = (applicationId) => getApplications().find((item) => item.applicationId === applicationId);

export const createApplication = (tender) => {
  const current = getApplications();
  const existing = current.find((item) => item.tenderId === tender.tenderId);
  if (existing) return existing;

  const application = {
    applicationId: `APP-${Date.now().toString().slice(-8)}`,
    tenderId: tender.tenderId,
    tenderTitle: tender.title,
    status: "SUBMITTED",
    submittedAt: new Date().toISOString(),
    tenderStatus: tender.status,
    documentIds: [],
    documentCount: 0,
    processingProgress: 15,
    complianceScore: null,
    riskLevel: "Pending",
  };
  write(KEYS.applications, [application, ...current]);
  return application;
};

export const markApplicationProcessing = (applicationId) => {
  const next = getApplications().map((item) =>
    item.applicationId === applicationId
      ? { ...item, status: "PROCESSING", processingProgress: Math.max(item.processingProgress || 15, 55) }
      : item,
  );
  write(KEYS.applications, next);
};

export const moveApplicationToAllotted = (applicationId) => {
  const next = getApplications().filter((item) => item.applicationId !== applicationId);
  write(KEYS.applications, next);
};

export const getUploadedDocuments = (tenderId) => read(KEYS.uploadedDocuments, {})[tenderId] || {};

export const saveUploadedDocuments = (tenderId, documents) => {
  const all = read(KEYS.uploadedDocuments, {});
  all[tenderId] = documents;
  write(KEYS.uploadedDocuments, all);
};

export const getAcknowledged = () => read(KEYS.acknowledged, []);
export const acknowledgeTender = (tenderId) => {
  const current = getAcknowledged();
  if (!current.includes(tenderId)) write(KEYS.acknowledged, [...current, tenderId]);
};

export const clearBidderDemoData = () => {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
};
