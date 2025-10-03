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


// Cleans a string by removing any trailing content in parentheses.
// e.g., "Apple (25,00%)" becomes "Apple"
function cleanItemName(name: string): string {
    if (typeof name !== 'string') return '';
    return name.split('(')[0].trim();
}

export const aggregateAndSort = (data: RowData[], keys: (keyof RowData)[], topN = 5): { topItems: { name: string; value: number; percentage: number }[], totalCount: number } => {
  const counts = new Map<string, number>();
  let totalCount = 0;

  data.forEach(row => {
    keys.forEach(key => {
      const rawItem = row[key] as string;
      if (rawItem && rawItem.trim() !== '' && rawItem.trim().toLowerCase() !== 'n/a' && rawItem.trim() !== '-') {
        const itemName = cleanItemName(rawItem);
        if (itemName) {
            const currentCount = (counts.get(itemName) || 0) + 1;
            counts.set(itemName, currentCount);
        }
        totalCount++;
      }
    });
  });
  
  if (totalCount === 0) {
    totalCount = 1; // Avoid division by zero
  }

  const sortedItems = Array.from(counts.entries())
    .map(([name, value]) => ({ 
        name, 
        value,
        percentage: (value / totalCount) * 100
    }))
    .sort((a, b) => b.value - a.value);

  return {
    topItems: sortedItems.slice(0, topN),
    totalCount: totalCount
  };
};
