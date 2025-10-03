"use client";

import { useMemo } from 'react';
import type { RowData } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ChartTooltipContent, ChartContainer } from '@/components/ui/chart';

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

const chartConfig = {
  percentage: {
    label: "Percentual",
    color: "hsl(var(--chart-3))",
  },
};

export function SocioEconomicChart({ data }: SocioEconomicChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];
    
    const totals = seKeys.map(key => ({
      name: key.replace('Nível Socioeconômico (', '').replace(')', ''),
      total: data.reduce((sum, row) => sum + (row[key] as number || 0), 0)
    }));

    const totalSum = totals.reduce((sum, item) => sum + item.total, 0);
    
    return totals.map(item => ({
        ...item,
        percentage: totalSum > 0 ? (item.total / totalSum) * 100 : 0
    }));

  }, [data]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Nível Socioeconômico</CardTitle>
        <CardDescription>
          Análise do público por classe socioeconômica.
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
