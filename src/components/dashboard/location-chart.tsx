"use client";

import { useMemo } from 'react';
import type { RowData } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ChartTooltipContent, ChartContainer } from '@/components/ui/chart';

type LocationChartProps = {
  data: RowData[];
};

const chartConfig = {
  count: {
    label: "PDXs",
    color: "hsl(var(--chart-2))",
  },
};

export function LocationChart({ data }: LocationChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];
    
    const countsByState = data.reduce((acc, row) => {
      const state = row.PDX_ESTADO;
      if (state && state.trim() !== '') {
        acc[state] = (acc[state] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(countsByState)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
      
  }, [data]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Distribuição Geográfica por Estado</CardTitle>
        <CardDescription>Contagem de pontos de dados (PDX) em cada estado.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                  <Tooltip
                      cursor={{fill: 'hsl(var(--muted))'}}
                      content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="count" name="PDXs" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
              </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
