"use client";

import { useMemo } from 'react';
import type { RowData } from '@/lib/types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ChartTooltipContent, ChartContainer, ChartLegendContent } from '@/components/ui/chart';

type GenderChartProps = {
  data: RowData[];
};

const chartConfig = {
  Masculino: {
    label: "Masculino",
    color: "hsl(var(--accent))",
  },
  Feminino: {
    label: "Feminino",
    color: "hsl(var(--primary))", 
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

    return [
        { name: 'Masculino', value: totals.male, fill: 'var(--color-Masculino)' },
        { name: 'Feminino', value: totals.female, fill: 'var(--color-Feminino)' }
    ];
  }, [data]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Distribuição por Gênero</CardTitle>
        <CardDescription>Análise do público por gênero.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full">
          <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                  <Tooltip
                      cursor={{fill: 'hsl(var(--muted))'}}
                      content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    labelLine={false}
                    label={({ cx, cy, midAngle, outerRadius, percent }) => {
                        const radius = outerRadius * 1.35;
                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                        
                        return (
                          <text 
                            x={x} 
                            y={y} 
                            fill="hsl(var(--foreground))"
                            textAnchor={x > cx ? 'start' : 'end'} 
                            dominantBaseline="central"
                            className="text-sm font-semibold"
                          >
                            {`${(percent * 100).toFixed(1)}%`}
                          </text>
                        );
                    }}
                  >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Legend content={<ChartLegendContent />} />
              </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
