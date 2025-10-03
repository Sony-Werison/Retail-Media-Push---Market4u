"use client";

import { useMemo } from 'react';
import type { RowData } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ChartTooltipContent, ChartContainer } from '@/components/ui/chart';
import { FilterControls } from './filter-controls';

type SocioEconomicChartProps = {
  data: RowData[];
  filter: string | null;
  onFilterChange: (filter: string | null) => void;
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
    color: "hsl(var(--chart-4))",
  },
};

export function SocioEconomicChart({ data, filter, onFilterChange }: SocioEconomicChartProps) {
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
        <CardTitle>Nível Socioeconômico</CardTitle>
        <CardDescription>
          <FilterControls 
            filterType='Classe'
            activeFilter={filter}
            onClearFilter={() => onFilterChange(null)}
            defaultDescription='Análise do público por classe socioeconômica.'
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} onClick={handleBarClick}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `${value.toFixed(0)}%`}/>
                    <Tooltip
                        cursor={{fill: 'hsl(var(--muted))'}}
                        content={<ChartTooltipContent indicator="dot" formatter={(value) => `${(value as number).toFixed(1)}%`}/>}
                    />
                    <Bar dataKey="percentage" name="Percentual" fill="var(--color-percentage)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
