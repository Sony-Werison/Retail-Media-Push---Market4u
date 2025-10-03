"use client";

import { useMemo } from 'react';
import type { RowData } from '@/lib/types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ChartTooltipContent, ChartContainer, ChartLegendContent } from '@/components/ui/chart';
import { FilterControls } from './filter-controls';

type GenderChartProps = {
  data: RowData[];
  filter: string | null;
  onFilterChange: (filter: string | null) => void;
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

export function GenderChart({ data, filter, onFilterChange }: GenderChartProps) {
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

  const handlePieClick = (payload: any) => {
    if (payload && payload.name) {
      if (payload.name === filter) {
        onFilterChange(null);
      } else {
        onFilterChange(payload.name);
      }
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Distribuição por Gênero</CardTitle>
        <CardDescription>
          <FilterControls 
            filterType='Gênero'
            activeFilter={filter}
            onClearFilter={() => onFilterChange(null)}
            defaultDescription='Análise do público por gênero.'
          />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full">
          <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                  <Tooltip
                      cursor={{fill: 'hsl(var(--muted))'}}
                      content={<ChartTooltipContent indicator="dot" nameKey="name" />}
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
                    onClick={handlePieClick}
                    label={({ cx, cy, midAngle, outerRadius, percent, payload }) => {
                        const radius = outerRadius * 1.35;
                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                        const isActive = filter === payload.name;
                        
                        return (
                          <text 
                            x={x} 
                            y={y} 
                            fill="hsl(var(--foreground))"
                            textAnchor={x > cx ? 'start' : 'end'} 
                            dominantBaseline="central"
                            className="text-sm"
                            style={{ fontWeight: isActive ? 'bold' : 'normal' }}
                          >
                            {`${(percent * 100).toFixed(1)}%`}
                          </text>
                        );
                    }}
                  >
                    {chartData.map((entry) => (
                        <Cell 
                          key={`cell-${entry.name}`} 
                          fill={entry.fill}
                          style={{
                            cursor: 'pointer',
                            opacity: filter === null || filter === entry.name ? 1 : 0.4
                          }}
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
