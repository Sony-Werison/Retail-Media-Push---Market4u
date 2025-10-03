import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { RowData } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseCountValue(value: string | number): number {
    if (typeof value === 'number') {
        return isNaN(value) ? 0 : value;
    }
    if (typeof value === 'string') {
        const cleanedString = value.split('(')[0].trim();
        const num = parseInt(cleanedString, 10);
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
      }
    });
  });
  
  const sortedItems = Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  sortedItems.forEach(item => {
    totalCount += item.value;
  });

  return {
    topItems: sortedItems.slice(0, topN),
    totalCount: totalCount
  };
};
