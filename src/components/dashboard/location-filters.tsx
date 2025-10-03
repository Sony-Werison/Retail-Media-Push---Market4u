"use client";

import { useMemo } from 'react';
import type { RowData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type LocationFiltersProps = {
  data: RowData[];
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  onNeighborhoodChange: (neighborhood: string) => void;
  filters: { state: string; city: string; neighborhood: string };
};

export function LocationFilters({ data, onStateChange, onCityChange, onNeighborhoodChange, filters }: LocationFiltersProps) {
  const { states, cities, neighborhoods } = useMemo(() => {
    const states = [...new Set(data.map(row => row.PDX_ESTADO).filter(Boolean))].sort();
    
    let cities: string[] = [];
    if (filters.state && filters.state !== 'all') {
      cities = [...new Set(
        data
          .filter(row => row.PDX_ESTADO === filters.state)
          .map(row => row.PDX_CIDADE)
          .filter(Boolean)
      )].sort();
    }

    let neighborhoods: string[] = [];
    if (filters.city && filters.city !== 'all') {
      neighborhoods = [...new Set(
        data
          .filter(row => row.PDX_CIDADE === filters.city)
          .map(row => row.PDX_BAIRRO)
          .filter(Boolean)
      )].sort();
    }
    
    return { states, cities, neighborhoods };
  }, [data, filters.state, filters.city]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Filtro Geográfico</CardTitle>
        <CardDescription>
          Selecione para filtrar os dados do dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="state-select">Estado</Label>
          <Select onValueChange={onStateChange} value={filters.state}>
            <SelectTrigger id="state-select">
              <SelectValue placeholder="Todos os estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os estados</SelectItem>
              {states.map(state => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city-select">Cidade</Label>
          <Select onValueChange={onCityChange} value={filters.city} disabled={filters.state === 'all'}>
            <SelectTrigger id="city-select">
              <SelectValue placeholder="Todas as cidades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as cidades</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="neighborhood-select">Bairro</Label>
          <Select onValueChange={onNeighborhoodChange} value={filters.neighborhood} disabled={filters.city === 'all'}>
            <SelectTrigger id="neighborhood-select">
              <SelectValue placeholder="Todos os bairros" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os bairros</SelectItem>
              {neighborhoods.map(neighborhood => (
                <SelectItem key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
