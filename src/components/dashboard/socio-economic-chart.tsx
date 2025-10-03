"use client";

import { useMemo } from 'react';
import type { RowData } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ChartTooltipContent } from '@/components/ui/chart';

type SocioEconomicChartProps = {
  data: RowData[];
};

const seKeys: (keyof RowData)[] = [
  'Nível Socioeconômico (A)',
  'Nível Socioeconômico (B)',
  'Nível Socioeconômico (C)',
  'Nível Socioeconômico (D)',
  'Nível Socioeconômico (E)',
];

export function SocioEconomicChart({ data }: SocioEconomicChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];
    
    return seKeys.map(key => ({
      name: key.replace('Nível Socioeconômico (', '').replace(')', ''),
      total: data.reduce((sum, row) => sum + (row[key] as number || 0), 0)
    }));
  }, [data]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Socio-Economic Level</CardTitle>
        <CardDescription>Audience breakdown by socio-economic class.</CardDescription>
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
                <Bar dataKey="total" name="Total" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
