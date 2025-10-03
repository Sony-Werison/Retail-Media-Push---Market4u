"use client";

import { useMemo } from 'react';
import type { RowData } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ChartTooltipContent, ChartContainer } from '@/components/ui/chart';

type GenderChartProps = {
  data: RowData[];
};

const chartConfig = {
  Masculino: {
    label: "Masculino",
    color: "hsl(var(--chart-1))",
  },
  Feminino: {
    label: "Feminino",
    color: "hsl(var(--chart-2))",
  },
};

export function GenderChart({ data }: GenderChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];
    
    const totals = data.reduce(
      (acc, row) => {
        acc.male += row['Gênero (Masculino)'];
        acc.female += row['Gênero (Feminino)'];
        return acc;
      },
      { male: 0, female: 0 }
    );

    return [{ name: 'Gênero', Masculino: totals.male, Feminino: totals.female }];
  }, [data]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Gender Distribution</CardTitle>
        <CardDescription>Breakdown by male and female audience.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip
                      cursor={{fill: 'hsl(var(--muted))'}}
                      content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Legend />
                  <Bar dataKey="Masculino" stackId="a" fill="var(--color-Masculino)" radius={[4, 4, 4, 4]} />
                  <Bar dataKey="Feminino" stackId="a" fill="var(--color-Feminino)" radius={[4, 4, 4, 4]} />
              </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
