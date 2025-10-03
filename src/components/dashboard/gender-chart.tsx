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
    color: "hsl(var(--chart-2))", 
  },
};

export function GenderChart({ data }: GenderChartProps) {
  const { chartData, totalValue } = useMemo(() => {
    if (!data) return { chartData: [], totalValue: 0 };
    
    const totals = data.reduce(
      (acc, row) => {
        acc.male += row['Gênero (Masculino)'];
        acc.female += row['Gênero (Feminino)'];
        return acc;
      },
      { male: 0, female: 0 }
    );

    const totalValue = totals.male + totals.female;

    const chartData = [
        { name: 'Masculino', value: totals.male, fill: 'var(--color-Masculino)' },
        { name: 'Feminino', value: totals.female, fill: 'var(--color-Feminino)' }
    ];

    return { chartData, totalValue };
  }, [data]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Distribuição por Gênero</CardTitle>
        <CardDescription>
          Análise do público por gênero.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                  <Tooltip
                      cursor={{fill: 'hsl(var(--muted))'}}
                      content={<ChartTooltipContent 
                        indicator="dot" 
                        nameKey="name"
                        formatter={(value, name) => {
                          const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
                          return `${name}: ${percentage.toFixed(1)}%`;
                        }}
                      />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, payload }) => {
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                        
                        return (
                          <text 
                            x={x} 
                            y={y} 
                            fill="hsl(var(--card-foreground))"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="text-sm font-bold"
                          >
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        );
                    }}
                  >
                    {chartData.map((entry) => (
                        <Cell 
                          key={`cell-${entry.name}`} 
                          fill={entry.fill}
                        />
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
