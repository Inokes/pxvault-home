const saved = localStorage.getItem("disclaimerAccepted");

export const state = {
  pages: [],
  disclaimerAccepted: saved === "true"
};