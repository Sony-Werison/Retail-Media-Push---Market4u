import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { RowData } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseValue(value: string | number | null | undefined): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') {
        return isNaN(value) ? 0 : value;
    }
    if (typeof value === 'string') {
        const cleanedString = value
            .replace(/\.(?=\d{3})/g, '') // Remove pontos de milhar
            .replace(',', '.')           // Substitui vírgula decimal por ponto
            .trim();
        const num = parseFloat(cleanedString);
        return isNaN(num) ? 0 : num;
    }
    return 0;
}

export const aggregateAndSort = (data: RowData[], keys: (keyof RowData)[], topN = 5): { topItems: { name: string; value: number }[], totalCount: number } => {
  const counts = new Map<string, number>();
  let totalCount = 0;

  data.forEach(row => {
    keys.forEach(key => {
      const item = row[key] as string;
      if (item && item.trim() !== '' && item.trim().toLowerCase() !== 'n/a' && item.trim() !== '-') {
        const currentCount = (counts.get(item) || 0) + 1;
        counts.set(item, currentCount);
        totalCount++;
      }
    });
  });
  
  const sortedItems = Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return {
    topItems: sortedItems.slice(0, topN),
    totalCount: totalCount
  };
};