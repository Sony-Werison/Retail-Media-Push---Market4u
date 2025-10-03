"use client";

import { useMemo } from 'react';
import type { RowData } from '@/lib/types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ChartTooltipContent, ChartContainer } from '@/components/ui/chart';

type GenderChartProps = {
  data: RowData[];
};

const chartConfig = {
  Masculino: {
    label: "Masculino",
    color: "hsl(210 100% 50%)", // Blue
  },
  Feminino: {
    label: "Feminino",
    color: "hsl(330 100% 70%)", // Pink
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
        { name: 'Masculino', value: totals.male, fill: chartConfig.Masculino.color },
        { name: 'Feminino', value: totals.female, fill: chartConfig.Feminino.color }
    ];
  }, [data]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Distribuição por Gênero</CardTitle>
        <CardDescription>Análise do público por gênero.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                  <Tooltip
                      cursor={{fill: 'hsl(var(--muted))'}}
                      content={<ChartTooltipContent indicator="dot" />}
                  />
                   <Legend content={({ payload }) => (
                      <ul className="flex justify-center gap-4 mt-4">
                        {payload?.map((entry, index) => (
                          <li key={`item-${index}`} className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-sm text-muted-foreground">{entry.value}</span>
                          </li>
                        ))}
                      </ul>
                    )} />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                        return (
                          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        );
                    }}
                  >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
              </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
