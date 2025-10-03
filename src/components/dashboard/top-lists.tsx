"use client";

import { useMemo } from "react";
import type { RowData } from "@/lib/types";
import { aggregateAndSort } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

type TopListsProps = {
  data: RowData[];
  title: string;
  keys: (keyof RowData)[];
};

export function TopLists({ data, title, keys }: TopListsProps) {
  const topItems = useMemo(() => aggregateAndSort(data, keys, 5), [data, keys]);

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
                    <span className="font-medium capitalize">{item.name.toLowerCase().replace(/_/g, ' ')}</span>
                </div>
                <span className="font-mono text-sm text-muted-foreground">{item.value.toLocaleString('pt-BR')}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No data available for this category.</p>
        )}
      </CardContent>
    </Card>
  );
}
