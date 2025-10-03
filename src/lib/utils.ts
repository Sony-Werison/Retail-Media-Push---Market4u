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


export const aggregateAndSort = (data: RowData[], keys: (keyof RowData)[], topN = 5): { name: string; value: number }[] => {
  const counts = new Map<string, number>();

  data.forEach(row => {
    keys.forEach(key => {
      const item = row[key] as string;
      if (item && item.trim() !== '' && item.trim().toLowerCase() !== 'n/a') {
        counts.set(item, (counts.get(item) || 0) + 1);
      }
    });
  });

  return Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, topN);
};
