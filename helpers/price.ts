export const parsePrice = (text: string): number => {
  const normalized = text.replace(/\s/g, "").replace(/[^\d.]/g, "");
  return Number(normalized);
};
