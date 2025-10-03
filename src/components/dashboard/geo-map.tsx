"use client";

import { useState, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import type { RowData, DemographicCategory } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


type GeoMapProps = {
  data: RowData[];
};

const ageRanges = ['Faixa Etária (18_24)', 'Faixa Etária (25_29)', 'Faixa Etária (30_39)', 'Faixa Etária (40_49)', 'Faixa Etária (50_59)', 'Faixa Etária (60_69)', 'Faixa Etária (70+)'];
const socioEconomicLevels = ['Nível Socioeconômico (A)', 'Nível Socioeconômico (B)', 'Nível Socioeconômico (C)', 'Nível Socioeconômico (D)', 'Nível Socioeconômico (E)'];

const colors = {
  'Faixa Etária': ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1'],
  'Nível Socioeconômico': ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f']
};


const getDominantCategory = (row: RowData, category: DemographicCategory): string => {
    const keys = category === 'Faixa Etária' ? ageRanges : socioEconomicLevels;
    let dominantKey = keys[0];
    let maxValue = 0;

    for (const key of keys) {
        const value = row[key as keyof RowData] as number;
        if (value > maxValue) {
            maxValue = value;
            dominantKey = key;
        }
    }
    return dominantKey;
};

export function GeoMap({ data }: GeoMapProps) {
  const [colorCategory, setColorCategory] = useState<DemographicCategory>("Faixa Etária");
  
  const center = useMemo(() => {
    if (!data || data.length === 0) return { lat: -23.5505, lng: -46.6333 };
    const validCoords = data.filter(d => typeof d.PDX_LAT === 'number' && typeof d.PDX_LNG === 'number' && !isNaN(d.PDX_LAT) && !isNaN(d.PDX_LNG));
    if (validCoords.length === 0) return { lat: -23.5505, lng: -46.6333 };
    
    const { latSum, lngSum } = validCoords.reduce(
      ({ latSum, lngSum }, row) => ({ latSum: latSum + row.PDX_LAT, lngSum: lngSum + row.PDX_LNG }),
      { latSum: 0, lngSum: 0 }
    );
    return { lat: latSum / validCoords.length, lng: lngSum / validCoords.length };
  }, [data]);
  

  const categoryMap = colorCategory === 'Faixa Etária' ? ageRanges : socioEconomicLevels;
  const colorScale = colors[colorCategory];
  const colorMapping = Object.fromEntries(categoryMap.map((key, i) => [key, colorScale[i % colorScale.length]]));

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle>Visualização Geográfica</CardTitle>
            <CardDescription>Localizações de PDX coloridas por demografia</CardDescription>
        </div>
        <Select value={colorCategory} onValueChange={(value: DemographicCategory) => setColorCategory(value)}>
            <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Colorir por..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Faixa Etária">Faixa Etária</SelectItem>
                <SelectItem value="Nível Socioeconômico">Nível Socioeconômico</SelectItem>
            </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 rounded-b-lg overflow-hidden p-0">
          <MapContainer center={[center.lat, center.lng]} zoom={10} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
              <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {data.map((row) => {
                  if (typeof row.PDX_LAT !== 'number' || typeof row.PDX_LNG !== 'number' || isNaN(row.PDX_LAT) || isNaN(row.PDX_LNG)) {
                    return null;
                  }
                  const dominantCategory = getDominantCategory(row, colorCategory);
                  const color = colorMapping[dominantCategory];
                  return (
                    <CircleMarker
                        key={row.ID}
                        center={[row.PDX_LAT, row.PDX_LNG]}
                        radius={8}
                        pathOptions={{ color: color, fillColor: color, fillOpacity: 0.7 }}
                    >
                      <Popup>
                        <div className="p-1 max-w-xs">
                          <h3 className="font-bold text-base mb-1">{row.NOME}</h3>
                          <p className="text-sm text-muted-foreground">{row.PDX_ENDERECO}, {row.PDX_NUMERO}</p>
                          <p className="text-sm mt-2"><strong>{colorCategory} Dominante:</strong> {getDominantCategory(row, colorCategory).replace(`${colorCategory} `, '').replace(/_/g, '-').replace('()', '').replace('Nível Socioeconômico', 'SEC')}</p>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
              })}
          </MapContainer>
      </CardContent>
    </Card>
  );
}