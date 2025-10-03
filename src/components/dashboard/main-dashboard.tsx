import type { RowData } from "@/lib/types";
import { AIAssistant } from "./ai-insights";
import { AgeChart } from "./age-chart";
import { GenderChart } from "./gender-chart";
import { SocioEconomicChart } from "./socio-economic-chart";
import { TopLists } from "./top-lists";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import React, { useState, useMemo } from "react";
import { LocationChart } from "./location-chart";
import { parseValue } from "@/lib/utils";

type FilterType = 'gender' | 'age' | 'socio';

type MainDashboardProps = {
  data: RowData[];
  csvString: string;
};

export function MainDashboard({ data, csvString }: MainDashboardProps) {
  const [activeFilters, setActiveFilters] = useState<Record<FilterType, string | null>>({
    gender: null,
    age: null,
    socio: null,
  });

  const handleFilterChange = (type: FilterType, value: string | null) => {
    setActiveFilters(prev => ({...prev, [type]: value }));
  };

  const filteredData = useMemo(() => {
    if (!activeFilters.gender && !activeFilters.age && !activeFilters.socio) {
      return data;
    }
    
    return data.filter(row => {
      if (activeFilters.gender) {
        const genderKey = `Gênero (${activeFilters.gender})` as keyof RowData;
        if (!row[genderKey] || parseValue(row[genderKey]) === 0) return false;
      }
      if (activeFilters.age) {
        const ageKey = `Faixa Etária (${activeFilters.age.replace('-', '_')})` as keyof RowData;
         if (!row[ageKey] || parseValue(row[ageKey]) === 0) return false;
      }
      if (activeFilters.socio) {
        const socioKey = `Nível Socioeconômico (${activeFilters.socio})` as keyof RowData;
        if (!row[socioKey] || parseValue(row[socioKey]) === 0) return false;
      }
      return true;
    });
  }, [data, activeFilters]);

  const totalImpacts = filteredData.reduce((sum, row) => sum + parseValue(row['Impactos Gerais']), 0);
  const totalReach = filteredData.reduce((sum, row) => sum + parseValue(row['Alcance Geral Target']), 0);
  const avgFrequency = totalReach > 0 ? totalImpacts / totalReach : 0;

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      
      <Card className="col-span-12 sm:col-span-4 lg:col-span-4">
        <CardHeader>
          <CardTitle>Impactos Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{totalImpacts.toLocaleString('pt-BR')}</p>
        </CardContent>
      </Card>
      
      <Card className="col-span-12 sm:col-span-4 lg:col-span-4">
        <CardHeader>
          <CardTitle>Alcance Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{totalReach.toLocaleString('pt-BR')}</p>
        </CardContent>
      </Card>

      <Card className="col-span-12 sm:col-span-4 lg:col-span-4">
        <CardHeader>
          <CardTitle>Frequência Média</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{avgFrequency.toFixed(2)}</p>
        </CardContent>
      </Card>

      <div className="col-span-12 lg:col-span-8 row-span-2">
        <LocationChart data={filteredData} />
      </div>

      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <AIAssistant csvData={csvString} />
      </div>

      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <GenderChart 
          data={filteredData} 
          filter={activeFilters.gender}
          onFilterChange={(value) => handleFilterChange('gender', value)}
        />
      </div>
      
      <div className="col-span-12 md:col-span-6 lg:col-span-6">
        <AgeChart 
          data={filteredData} 
          filter={activeFilters.age}
          onFilterChange={(value) => handleFilterChange('age', value)}
        />
      </div>
      
      <div className="col-span-12 md:col-span-6 lg:col-span-6">
        <SocioEconomicChart 
          data={filteredData}
          filter={activeFilters.socio}
          onFilterChange={(value) => handleFilterChange('socio', value)}
        />
      </div>

       <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <TopLists data={filteredData} title="Top Marcas" keys={['#1 Marca', '#2 Marca', '#3 Marca']} />
      </div>
      
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <TopLists data={filteredData} title="Top Modelos" keys={['#1 Modelo', '#2 Modelo', '#3 Modelo']} />
      </div>
      
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <TopLists data={filteredData} title="Top Operadoras" keys={['#1 Operadora', '#2 Operadora', '#3 Operadora']} />
      </div>

      <div className="col-span-12 md:col-span-6">
        <TopLists data={filteredData} title="Perfil de Interesses" keys={['#1 Comportamento Offline', '#2 Comportamento Offline', '#3 Comportamento Offline']} />
      </div>
      
      <div className="col-span-12 md:col-span-6">
        <TopLists data={filteredData} title="Uso de Apps" keys={['#1 Uso de Apps', '#2 Uso de Apps', '#3 Uso de Apps']} />
      </div>

    </div>
  );
}
