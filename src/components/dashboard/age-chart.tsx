"use client";

import { useMemo } from 'react';
import type { RowData } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ChartTooltipContent } from '@/components/ui/chart';

type AgeChartProps = {
  data: RowData[];
};

const ageKeys: (keyof RowData)[] = [
  'Faixa Etária (18_24)',
  'Faixa Etária (25_29)',
  'Faixa Etária (30_39)',
  'Faixa Etária (40_49)',
  'Faixa Etária (50_59)',
  'Faixa Etária (60_69)',
  'Faixa Etária (70+)',
];

export function AgeChart({ data }: AgeChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];
    
    const totals = ageKeys.map(key => ({
      name: key.replace('Faixa Etária (', '').replace(')', '').replace(/_/g, '-'),
      total: data.reduce((sum, row) => sum + (row[key] as number || 0), 0)
    }));

    return totals;
  }, [data]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Age Range Distribution</CardTitle>
        <CardDescription>Audience breakdown by age groups.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip
                    cursor={{fill: 'hsl(var(--muted))'}}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="total" name="Total" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
