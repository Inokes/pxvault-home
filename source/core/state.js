const saved = localStorage.getItem("disclaimerAccepted");

export const state = {
  pages: [],
  facts: [],
  disclaimerAccepted: saved === "true",
  features: {},
  profileImages: []
};
