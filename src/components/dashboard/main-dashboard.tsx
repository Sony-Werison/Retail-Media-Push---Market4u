import type { RowData } from "@/lib/types";
import { AgeChart } from "./age-chart";
import { GenderChart } from "./gender-chart";
import { SocioEconomicChart } from "./socio-economic-chart";
import { TopLists } from "./top-lists";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import React, { useMemo } from "react";
import { parseValue } from "@/lib/utils";
import { interestTranslations, appUsageTranslations } from "@/lib/translations";
import dynamic from "next/dynamic";

const MapChart = dynamic(() => import('./map-chart').then(mod => mod.MapChart), {
  ssr: false,
  loading: () => <div className="h-[425px] w-full bg-muted rounded-lg flex items-center justify-center"><p>Carregando mapa...</p></div>
});


type MainDashboardProps = {
  data: RowData[];
};

export function MainDashboard({ data }: MainDashboardProps) {
  
  const totalImpacts = useMemo(() => data.reduce((sum, row) => sum + parseValue(row['Impactos Gerais']), 0), [data]);
  const totalReach = useMemo(() => data.reduce((sum, row) => sum + parseValue(row['Alcance Geral Target']), 0), [data]);
  const avgFrequency = useMemo(() => (totalReach > 0 ? totalImpacts / totalReach : 0), [totalImpacts, totalReach]);
  
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

      <div className="col-span-12 lg:col-span-8">
        <MapChart data={data} />
      </div>

      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <GenderChart data={data} />
      </div>
      
      <div className="col-span-12 md:col-span-6 lg:col-span-6">
        <AgeChart data={data} />
      </div>
      
      <div className="col-span-12 md:col-span-6 lg:col-span-6">
        <SocioEconomicChart data={data} />
      </div>

       <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <TopLists data={data} title="Top Marcas" keys={['#1 Marca', '#2 Marca', '#3 Marca']} />
      </div>
      
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <TopLists data={data} title="Top Modelos" keys={['#1 Modelo', '#2 Modelo', '#3 Modelo']} />
      </div>
      
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <TopLists data={data} title="Top Operadoras" keys={['#1 Operadora', '#2 Operadora', '#3 Operadora']} />
      </div>

      <div className="col-span-12 md:col-span-6">
        <TopLists 
          data={data} 
          title="Perfil de Interesses" 
          keys={['#1 Comportamento Offline', '#2 Comportamento Offline', '#3 Comportamento Offline']}
          translationMap={interestTranslations} 
        />
      </div>
      
      <div className="col-span-12 md:col-span-6">
        <TopLists 
          data={data} 
          title="Uso de Apps" 
          keys={['#1 Uso de Apps', '#2 Uso de Apps', '#3 Uso de Apps']}
          translationMap={appUsageTranslations}
        />
      </div>

    </div>
  );
}
