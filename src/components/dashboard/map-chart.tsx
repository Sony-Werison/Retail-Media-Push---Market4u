"use client";

import { useMemo } from 'react';
import type { RowData } from '@/lib/types';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import L from 'leaflet';
import { parseValue } from '@/lib/utils';

type MapChartProps = {
  data: RowData[];
};

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MIN_RADIUS = 2;
const MAX_RADIUS = 15;

export function MapChart({ data }: MapChartProps) {
  const { points, mapCenter, bounds } = useMemo(() => {
    const validPoints = data
      .filter(row => typeof row.PDX_LAT === 'number' && typeof row.PDX_LNG === 'number' && !isNaN(row.PDX_LAT) && !isNaN(row.PDX_LNG))
      .map(row => ({
        lat: row.PDX_LAT,
        lng: row.PDX_LNG,
        name: row.NOME,
        address: `${row.PDX_ENDERECO}, ${row.PDX_CIDADE}`,
        impacts: parseValue(row['Impactos Gerais'])
      }));

    if (validPoints.length === 0) {
      return {
        points: [],
        mapCenter: { lat: -14.235, lng: -51.9253 }, // Brazil center
        bounds: undefined
      };
    }
    
    const impacts = validPoints.map(p => p.impacts);
    const minImpact = Math.min(...impacts);
    const maxImpact = Math.max(...impacts);

    const pointsWithRadius = validPoints.map(p => {
      let radius = MIN_RADIUS;
      if (maxImpact > minImpact) {
        // Normalize impacts to a 0-1 scale and then map to radius range
        const scale = (p.impacts - minImpact) / (maxImpact - minImpact);
        radius = MIN_RADIUS + (scale * (MAX_RADIUS - MIN_RADIUS));
      }
      return { ...p, radius };
    });

    const lats = validPoints.map(p => p.lat);
    const lngs = validPoints.map(p => p.lng);
    const avgLat = lats.reduce((a, b) => a + b, 0) / validPoints.length;
    const avgLng = lngs.reduce((a, b) => a + b, 0) / validPoints.length;
    
    const corner1 = L.latLng(Math.min(...lats), Math.min(...lngs));
    const corner2 = L.latLng(Math.max(...lats), Math.max(...lngs));
    const bounds = L.latLngBounds(corner1, corner2);

    return { 
      points: pointsWithRadius, 
      mapCenter: { lat: avgLat, lng: avgLng },
      bounds
    };
  }, [data]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Distribuição Geográfica e Impacto</CardTitle>
        <CardDescription>Visualização dos PDXs. O raio de cada ponto representa o total de impactos.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 -m-6 mt-0">
        <MapContainer 
          center={[mapCenter.lat, mapCenter.lng]} 
          zoom={4} 
          scrollWheelZoom={false}
          style={{ height: '425px', width: '100%', borderRadius: "0 0 0.5rem 0.5rem" }}
          bounds={bounds}
          boundsOptions={{padding: [50,50]}}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {points.map((point, idx) => (
            <CircleMarker 
              key={idx} 
              center={[point.lat, point.lng]}
              radius={point.radius}
              pathOptions={{ 
                color: 'hsl(var(--primary))',
                fillColor: 'hsl(var(--primary))', 
                fillOpacity: 0.6 
              }}
            >
              <Tooltip>
                <strong>{point.name}</strong><br/>
                {point.address}<br/>
                Impactos: {point.impacts.toLocaleString('pt-BR')}
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
}
