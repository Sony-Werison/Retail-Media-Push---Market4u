"use client";

import { useMemo } from 'react';
import type { RowData } from '@/lib/types';
import { Pie, PieChart, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ChartTooltipContent, ChartContainer } from '@/components/ui/chart';
import { parseValue } from '@/lib/utils';

type PlatformChartProps = {
  data: RowData[];
};

const platformKeys: (keyof RowData)[] = [
  'Plataforma (ios)',
  'Plataforma (Android)',
];

const chartConfig = {
  'iOS': {
    label: 'iOS',
    color: 'hsl(var(--chart-1))',
  },
  'Android': {
    label: 'Android',
    color: 'hsl(var(--chart-2))',
  },
};

// Extracts percentage from a string like "iOS (55,00%)" -> 55
function extractPercentage(value: string | number): number {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return 0;
    
    const match = value.match(/\(([^)]+)\)/);
    if (!match || !match[1]) return 0;
    
    return parseValue(match[1].replace('%', ''));
}


export function PlatformChart({ data }: PlatformChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];
    
    const totals = data.reduce(
      (acc, row) => {
        // Check dedicated columns first
        let iosValue = parseValue(row['Plataforma (ios)']);
        let androidValue = parseValue(row['Plataforma (Android)']);

        acc.ios += iosValue;
        acc.android += androidValue;
        
        return acc;
      },
      { ios: 0, android: 0 }
    );

    if (totals.ios > 0 || totals.android > 0) {
        return [
          { name: 'iOS', value: totals.ios, fill: chartConfig['iOS'].color },
          { name: 'Android', value: totals.android, fill: chartConfig['Android'].color },
        ];
    }
    
    // Fallback logic if dedicated columns are empty
    const platformColumns: (keyof RowData)[] = ['#1 Plataforma', '#2 Plataforma', '#3 Plataforma'];
    let weightedTotals = { ios: 0, android: 0, count: 0 };

    data.forEach(row => {
        platformColumns.forEach(col => {
            const val = row[col] as string;
            if (val && typeof val === 'string') {
                const percentage = extractPercentage(val);
                if(val.toLowerCase().includes('ios')) {
                    weightedTotals.ios += percentage;
                } else if (val.toLowerCase().includes('android')) {
                    weightedTotals.android += percentage;
                }
            }
        });
        weightedTotals.count++;
    });

    if (weightedTotals.count > 0) {
        return [
          { name: 'iOS', value: weightedTotals.ios / weightedTotals.count, fill: chartConfig['iOS'].color },
          { name: 'Android', value: weightedTotals.android / weightedTotals.count, fill: chartConfig['Android'].color },
        ].filter(item => item.value > 0);
    }

    return [];

  }, [data]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Distribuição por Plataforma</CardTitle>
        <CardDescription>Análise por sistema operacional móvel.</CardDescription>
      </CardHeader>
      <CardContent>
       {chartData.length > 0 ? (
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Tooltip
                        content={<ChartTooltipContent indicator="dot" formatter={(value) => `${(value as number).toFixed(2)}%`}/>}
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
                            if (percent === 0) return null;
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
         ) : (
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            Nenhum dado de plataforma disponível.
          </div>
        )}
      </CardContent>
    </Card>
  );
}