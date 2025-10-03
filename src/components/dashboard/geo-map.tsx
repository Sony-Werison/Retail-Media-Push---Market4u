"use client";

import { useState, useMemo } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import type { RowData, DemographicCategory } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

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
  const [activeMarker, setActiveMarker] = useState<RowData | null>(null);
  const [colorCategory, setColorCategory] = useState<DemographicCategory>("Faixa Etária");

  const center = useMemo(() => {
    if (data.length === 0) return { lat: -23.5505, lng: -46.6333 };
    const { latSum, lngSum } = data.reduce(
      ({ latSum, lngSum }, row) => ({ latSum: latSum + row.PDX_LAT, lngSum: lngSum + row.PDX_LNG }),
      { latSum: 0, lngSum: 0 }
    );
    return { lat: latSum / data.length, lng: lngSum / data.length };
  }, [data]);
  
  if (!API_KEY) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Geographic Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Google Maps API Key Missing</AlertTitle>
            <AlertDescription>
              Please add your Google Maps API Key to a <code>.env.local</code> file as <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable map features.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const categoryMap = colorCategory === 'Faixa Etária' ? ageRanges : socioEconomicLevels;
  const colorScale = colors[colorCategory];
  const colorMapping = Object.fromEntries(categoryMap.map((key, i) => [key, colorScale[i % colorScale.length]]));

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle>Geographic Visualization</CardTitle>
            <CardDescription>PDX locations colored by demographic</CardDescription>
        </div>
        <Select value={colorCategory} onValueChange={(value: DemographicCategory) => setColorCategory(value)}>
            <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Color by..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Faixa Etária">Faixa Etária</SelectItem>
                <SelectItem value="Nível Socioeconômico">Nível Socioeconômico</SelectItem>
            </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 rounded-b-lg overflow-hidden">
        <APIProvider apiKey={API_KEY}>
            <div style={{ height: '100%', width: '100%' }}>
                <Map
                    defaultCenter={center}
                    defaultZoom={10}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    mapId="logan_map"
                >
                {data.map((row) => {
                    const dominantCategory = getDominantCategory(row, colorCategory);
                    const color = colorMapping[dominantCategory];
                    return (
                        <AdvancedMarker
                            key={row.ID}
                            position={{ lat: row.PDX_LAT, lng: row.PDX_LNG }}
                            onClick={() => setActiveMarker(row)}
                        >
                            <Pin background={color} borderColor="#333" glyphColor="#fff"/>
                        </AdvancedMarker>
                    );
                })}

                {activeMarker && (
                    <InfoWindow
                        position={{ lat: activeMarker.PDX_LAT, lng: activeMarker.PDX_LNG }}
                        onCloseClick={() => setActiveMarker(null)}
                    >
                        <div className="p-2 max-w-xs">
                            <h3 className="font-bold text-base mb-1">{activeMarker.NOME}</h3>
                            <p className="text-sm text-muted-foreground">{activeMarker.PDX_ENDERECO}, {activeMarker.PDX_NUMERO}</p>
                             <p className="text-sm mt-2"><strong>Dominant {colorCategory}:</strong> {getDominantCategory(activeMarker, colorCategory).replace(`${colorCategory} `, '').replace(/_/g, '-').replace('Nível Socioeconômico', 'SEC')}</p>
                        </div>
                    </InfoWindow>
                )}
                </Map>
            </div>
        </APIProvider>
      </CardContent>
    </Card>
  );
}
