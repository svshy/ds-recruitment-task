const parseCount = (text: string) => Number(text.replace(/\D/g, ""));

export function getMaxCountAndIndex(counts: string[]): { index: number; count: number } {
  if (counts.length === 0) throw new Error("Cannot find max of empty counts array");
  const parsed = counts.map(parseCount);
  const max = Math.max(...parsed);
  return { index: parsed.indexOf(max), count: max };
}

export function sumCounts(counts: string[]): number {
  return counts.map(parseCount).reduce((acc, curr) => acc + curr, 0);
}
