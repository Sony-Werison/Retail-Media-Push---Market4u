"use client";

import { useMemo } from 'react';
import type { RowData } from '@/lib/types';
import { Pie, PieChart, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ChartTooltipContent, ChartContainer } from '@/components/ui/chart';

type PlatformChartProps = {
  data: RowData[];
};

const chartConfig = {
  iOS: {
    label: 'iOS',
    color: 'hsl(var(--chart-1))',
  },
  Android: {
    label: 'Android',
    color: 'hsl(var(--chart-2))',
  },
};

export function PlatformChart({ data }: PlatformChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];
    
    const totals = data.reduce(
      (acc, row) => {
        acc.ios += row['Plataforma (ios)'];
        acc.android += row['Plataforma (Android)'];
        return acc;
      },
      { ios: 0, android: 0 }
    );

    return [
      { name: 'iOS', value: totals.ios, fill: 'var(--color-iOS)' },
      { name: 'Android', value: totals.android, fill: 'var(--color-Android)' },
    ];
  }, [data]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Platform Distribution</CardTitle>
        <CardDescription>Breakdown by mobile operating system.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Tooltip
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Legend />
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
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
                        {chartData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
