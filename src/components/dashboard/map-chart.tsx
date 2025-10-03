"use client";

import { useMemo } from 'react';
import type { RowData } from '@/lib/types';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import L from 'leaflet';

type MapChartProps = {
  data: RowData[];
};

// Fix for default icon not showing up in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


export function MapChart({ data }: MapChartProps) {
  const points = useMemo(() => {
    return data
      .filter(row => typeof row.PDX_LAT === 'number' && typeof row.PDX_LNG === 'number')
      .map(row => ({
        lat: row.PDX_LAT,
        lng: row.PDX_LNG,
        name: row.NOME,
        address: `${row.PDX_ENDERECO}, ${row.PDX_CIDADE}`
      }));
  }, [data]);

  const mapCenter = useMemo(() => {
    if (points.length === 0) return { lat: -14.235, lng: -51.9253 }; // Brazil center
    
    const lats = points.map(p => p.lat);
    const lngs = points.map(p => p.lng);
    const avgLat = lats.reduce((a, b) => a + b, 0) / points.length;
    const avgLng = lngs.reduce((a, b) => a + b, 0) / points.length;
    
    return { lat: avgLat, lng: avgLng };
  }, [points]);

  return (
    <Card className="h-[425px] flex flex-col">
      <CardHeader>
        <CardTitle>Distribuição Geográfica</CardTitle>
        <CardDescription>Visualização dos pontos de dados (PDXs) no mapa.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 -m-6 mt-0">
        <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={4} scrollWheelZoom={true} style={{ height: '100%', width: '100%', borderRadius: "0 0 0.5rem 0.5rem" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {points.map((point, idx) => (
            <CircleMarker 
              key={idx} 
              center={[point.lat, point.lng]}
              radius={5}
              pathOptions={{ 
                color: 'hsl(var(--primary))',
                fillColor: 'hsl(var(--primary))', 
                fillOpacity: 0.7 
              }}
            >
              <Tooltip>
                <strong>{point.name}</strong><br/>
                {point.address}
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
}
