"use client";

import { useMemo } from "react";
import type { RowData } from "@/lib/types";
import { aggregateAndSort } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

type TopListsProps = {
  data: RowData[];
  title: string;
  keys: (keyof RowData)[];
  translationMap?: { [key: string]: string };
};

export function TopLists({ data, title, keys, translationMap }: TopListsProps) {
  const { topItems } = useMemo(() => aggregateAndSort(data, keys, 5, translationMap), [data, keys, translationMap]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {topItems.length > 0 ? (
          <ul className="space-y-3">
            {topItems.map((item, index) => (
              <li key={item.name} className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">{index + 1}</Badge>
                    <span className="font-medium capitalize">{item.name.toLowerCase()}</span>
                </div>
                <span className="font-mono text-sm text-muted-foreground">{item.percentage.toFixed(2)}%</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhum dado disponível para esta categoria.</p>
        )}
      </CardContent>
    </Card>
  );
}
