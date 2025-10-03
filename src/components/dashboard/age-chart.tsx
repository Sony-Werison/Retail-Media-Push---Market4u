"use client";

import { useMemo } from 'react';
import type { RowData } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ChartTooltipContent, ChartContainer } from '@/components/ui/chart';

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

const chartConfig = {
  percentage: {
    label: "Percentual",
    color: "hsl(var(--primary))",
  },
};

export function AgeChart({ data }: AgeChartProps) {
  const { chartData } = useMemo(() => {
    if (!data) return { chartData: [] };
    
    const totals = ageKeys.map(key => ({
      name: key.replace('Faixa Etária (', '').replace(')', '').replace(/_/g, '-'),
      total: data.reduce((sum, row) => sum + (row[key] as number || 0), 0)
    }));

    const totalSum = totals.reduce((sum, item) => sum + item.total, 0);

    const chartData = totals.map(item => ({
        ...item,
        percentage: totalSum > 0 ? (item.total / totalSum) * 100 : 0
    }));

    return { chartData };
  }, [data]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Distribuição por Faixa Etária</CardTitle>
        <CardDescription>
          Análise do público por grupos de idade.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(value) => `${value.toFixed(0)}%`}/>
                  <Tooltip
                      cursor={{fill: 'hsl(var(--muted))'}}
                      content={<ChartTooltipContent indicator="dot" formatter={(value) => `${(value as number).toFixed(1)}%`} />}
                  />
                  <Bar dataKey="percentage" name="Percentual" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry) => (
                      <Cell 
                        key={`cell-${entry.name}`} 
                        fill="var(--color-percentage)"
                      />
                    ))}
                  </Bar>
              </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
