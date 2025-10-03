"use client";

import { useMemo } from 'react';
import type { RowData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';

type LocationFiltersProps = {
  data: RowData[];
  onStateChange: (states: string[]) => void;
  onCityChange: (cities: string[]) => void;
  onNeighborhoodChange: (neighborhoods: string[]) => void;
  filters: { states: string[]; cities: string[]; neighborhoods: string[] };
};

export function LocationFilters({ data, onStateChange, onCityChange, onNeighborhoodChange, filters }: LocationFiltersProps) {
  const { states, cities, neighborhoods } = useMemo(() => {
    const states = [...new Set(data.map(row => row.PDX_ESTADO).filter(Boolean))].sort();
    
    let cities: string[] = [];
    if (filters.states.length > 0) {
      cities = [...new Set(
        data
          .filter(row => filters.states.includes(row.PDX_ESTADO))
          .map(row => row.PDX_CIDADE)
          .filter(Boolean)
      )].sort();
    } else {
      // If no state is selected, show all cities from all states
      cities = [...new Set(data.map(row => row.PDX_CIDADE).filter(Boolean))].sort();
    }

    let neighborhoods: string[] = [];
    if (filters.cities.length > 0) {
      neighborhoods = [...new Set(
        data
          .filter(row => filters.cities.includes(row.PDX_CIDADE))
          .map(row => row.PDX_BAIRRO)
          .filter(Boolean)
      )].sort();
    } else if (filters.states.length > 0) {
        // if no city selected, but state is, show neighborhoods from selected states
        neighborhoods = [...new Set(
            data
              .filter(row => filters.states.includes(row.PDX_ESTADO))
              .map(row => row.PDX_BAIRRO)
              .filter(Boolean)
          )].sort();
    } else {
      // If no city is selected, show all neighborhoods
      neighborhoods = [...new Set(data.map(row => row.PDX_BAIRRO).filter(Boolean))].sort();
    }
    
    return { states, cities, neighborhoods };
  }, [data, filters.states, filters.cities]);

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
          <MultiSelect
            id="state-select"
            options={states.map(s => ({ value: s, label: s }))}
            selected={filters.states}
            onChange={onStateChange}
            placeholder="Todos os estados"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city-select">Cidade</Label>
          <MultiSelect
            id="city-select"
            options={cities.map(c => ({ value: c, label: c }))}
            selected={filters.cities}
            onChange={onCityChange}
            placeholder="Todas as cidades"
            className="w-full"
            disabled={cities.length === 0}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="neighborhood-select">Bairro</Label>
          <MultiSelect
            id="neighborhood-select"
            options={neighborhoods.map(n => ({ value: n, label: n }))}
            selected={filters.neighborhoods}
            onChange={onNeighborhoodChange}
            placeholder="Todos os bairros"
            className="w-full"
            disabled={neighborhoods.length === 0}
          />
        </div>
      </CardContent>
    </Card>
  );
}
