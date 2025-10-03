import type { RowData } from "@/lib/types";
import { AIAssistant } from "./ai-insights";
import { AgeChart } from "./age-chart";
import { GenderChart } from "./gender-chart";
import { SocioEconomicChart } from "./socio-economic-chart";
import { TopLists } from "./top-lists";
import { PlatformChart } from "./platform-chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import React from "react";
import { LocationChart } from "./location-chart";
import { parseValue } from "@/lib/utils";


type MainDashboardProps = {
  data: RowData[];
  csvString: string;
};

export function MainDashboard({ data, csvString }: MainDashboardProps) {

  const totalImpacts = data.reduce((sum, row) => sum + parseValue(row['Impactos Gerais']), 0);
  const totalReach = data.reduce((sum, row) => sum + parseValue(row['Alcance Geral Target']), 0);
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
        <LocationChart data={data} />
      </div>

      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <AIAssistant csvData={csvString} />
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

      <div className="col-span-12 lg:col-span-12">
        <PlatformChart data={data} />
      </div>

      <div className="col-span-12 md:col-span-6">
        <TopLists data={data} title="Comportamento Offline" keys={['#1 Comportamento Offline', '#2 Comportamento Offline', '#3 Comportamento Offline']} />
      </div>
      
      <div className="col-span-12 md:col-span-6">
        <TopLists data={data} title="Uso de Apps" keys={['#1 Uso de Apps', '#2 Uso de Apps', '#3 Uso de Apps']} />
      </div>

    </div>
  );
}