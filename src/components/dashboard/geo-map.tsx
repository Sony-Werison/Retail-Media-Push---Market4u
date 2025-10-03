"use client";

import { useMemo } from 'react';
import type { RowData } from '@/lib/types';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ZAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ChartTooltipContent, ChartContainer } from '@/components/ui/chart';

type GeoMapProps = {
  data: RowData[];
};

const chartConfig = {
  pdx: {
    label: "PDX",
    color: "hsl(var(--chart-2))",
  },
};

// Function to calculate Interquartile Range (IQR) to identify outliers
function getIQR(arr: number[]): [number, number] {
    const sorted = arr.slice().sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length / 4)];
    const q3 = sorted[Math.floor(sorted.length * 3 / 4)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    return [lowerBound, upperBound];
}

export function GeoMap({ data }: GeoMapProps) {
  const chartData = useMemo(() => {
    if (!data) return [];
    
    return data.filter(d => 
        typeof d.PDX_LNG === 'number' && isFinite(d.PDX_LNG) &&
        typeof d.PDX_LAT === 'number' && isFinite(d.PDX_LAT)
    ).map(d => ({
        x: d.PDX_LNG,
        y: d.PDX_LAT,
        z: 1 // dummy value for size
    }));
      
  }, [data]);

  const domain = useMemo(() => {
    if (chartData.length === 0) return { x: [0,0], y: [0,0] };

    const longitudes = chartData.map(d => d.x);
    const latitudes = chartData.map(d => d.y);
    
    const [longLower, longUpper] = getIQR(longitudes);
    const [latLower, latUpper] = getIQR(latitudes);

    const filteredLongitudes = longitudes.filter(lng => lng >= longLower && lng <= longUpper);
    const filteredLatitudes = latitudes.filter(lat => lat >= latLower && lat <= latUpper);
    
    if (filteredLongitudes.length === 0 || filteredLatitudes.length === 0) {
      return {
        x: [Math.min(...longitudes), Math.max(...longitudes)],
        y: [Math.min(...latitudes), Math.max(...latitudes)]
      }
    }

    const minLng = Math.min(...filteredLongitudes);
    const maxLng = Math.max(...filteredLongitudes);
    const minLat = Math.min(...filteredLatitudes);
    const maxLat = Math.max(...filteredLatitudes);

    const bufferX = (maxLng - minLng) * 0.1;
    const bufferY = (maxLat - minLat) * 0.1;

    return {
        x: [minLng - bufferX, maxLng + bufferX],
        y: [minLat - bufferY, maxLat + bufferY]
    }
  }, [chartData]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Mapa de Pontos</CardTitle>
        <CardDescription>Distribuição geográfica dos pontos de dados (PDX).</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Longitude" 
                domain={domain.x} 
                tickCount={5}
                tickFormatter={(val) => val.toFixed(2)}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Latitude" 
                domain={domain.y}
                tickCount={5}
                tickFormatter={(val) => val.toFixed(2)}
              />
              <ZAxis dataKey="z" range={[10, 10]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                content={<ChartTooltipContent 
                    formatter={(value, name) => `${name}: ${value.toFixed(4)}`} 
                />}
              />
              <Scatter name="PDX" data={chartData} fill="var(--color-pdx)" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
