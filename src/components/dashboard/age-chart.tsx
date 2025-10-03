"use client";

import { useMemo } from 'react';
import type { RowData } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ChartTooltipContent, ChartContainer } from '@/components/ui/chart';
import { FilterControls } from './filter-controls';

type AgeChartProps = {
  data: RowData[];
  filter: string | null;
  onFilterChange: (filter: string | null) => void;
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
    color: "hsl(var(--chart-3))",
  },
};

export function AgeChart({ data, filter, onFilterChange }: AgeChartProps) {
  const { chartData, totalSum } = useMemo(() => {
    if (!data) return { chartData: [], totalSum: 0 };
    
    const totals = ageKeys.map(key => ({
      name: key.replace('Faixa Etária (', '').replace(')', '').replace(/_/g, '-'),
      total: data.reduce((sum, row) => sum + (row[key] as number || 0), 0)
    }));

    const totalSum = totals.reduce((sum, item) => sum + item.total, 0);

    const chartData = totals.map(item => ({
        ...item,
        percentage: totalSum > 0 ? (item.total / totalSum) * 100 : 0
    }));

    return { chartData, totalSum };
  }, [data]);

  const handleBarClick = (payload: any) => {
    if (payload && payload.activePayload && payload.activePayload.length > 0) {
      const clickedBar = payload.activePayload[0].payload;
      if (clickedBar.name === filter) {
        onFilterChange(null);
      } else {
        onFilterChange(clickedBar.name);
      }
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Distribuição por Faixa Etária</CardTitle>
        <CardDescription>
          <FilterControls 
            filterType='Faixa Etária'
            activeFilter={filter}
            onClearFilter={() => onFilterChange(null)}
            defaultDescription='Análise do público por grupos de idade.'
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={chartData}
                onClick={handleBarClick}
              >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(value) => `${value.toFixed(0)}%`}/>
                  <Tooltip
                      cursor={{fill: 'hsl(var(--muted))'}}
                      content={<ChartTooltipContent indicator="dot" formatter={(value) => `${(value as number).toFixed(1)}%`} />}
                  />
                  <Bar dataKey="percentage" name="Percentual" fill="var(--color-percentage)" radius={[4, 4, 0, 0]} />
              </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
