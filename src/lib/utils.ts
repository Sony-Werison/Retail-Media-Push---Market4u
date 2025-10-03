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
            .replace(/\.(?=\d{3})/g, '') 
            .replace(',', '.')           
            .trim();
        const num = parseFloat(cleanedString);
        return isNaN(num) ? 0 : num;
    }
    return 0;
}


function cleanItemName(name: string): string {
    if (typeof name !== 'string') return '';
    return name.split('(')[0].trim();
}

export const aggregateAndSort = (data: RowData[], keys: (keyof RowData)[], topN = 5, translationMap?: { [key: string]: string }): { topItems: { name: string; value: number; percentage: number }[], totalCount: number } => {
  const counts = new Map<string, number>();
  let totalValue = 0;

  data.forEach(row => {
    keys.forEach(key => {
      const rawItem = row[key] as string;
      if (rawItem && rawItem.trim() !== '' && rawItem.trim().toLowerCase() !== 'n/a' && rawItem.trim() !== '-') {
        const cleanedName = cleanItemName(rawItem);
        
        let finalName = cleanedName;
        if (translationMap) {
          // Find the key in the translation map, ignoring case.
          const translationKey = Object.keys(translationMap).find(
            (k) => k.toLowerCase() === cleanedName.toLowerCase()
          );
          if (translationKey) {
            finalName = translationMap[translationKey];
          }
        }

        if (finalName) {
          counts.set(finalName, (counts.get(finalName) || 0) + 1);
        }
        // We count every valid entry to calculate percentage correctly
        totalValue++;
      }
    });
  });
  
  if (totalValue === 0) {
    totalValue = 1; // Avoid division by zero
  }

  const sortedItems = Array.from(counts.entries())
    .map(([name, value]) => ({ 
        name, 
        value,
        percentage: (value / totalValue) * 100
    }))
    .sort((a, b) => b.value - a.value);

  return {
    topItems: sortedItems.slice(0, topN),
    totalCount: totalValue
  };
};