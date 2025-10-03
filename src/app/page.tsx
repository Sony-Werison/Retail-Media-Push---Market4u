"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import type { RowData } from "@/lib/types";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";
import { parseValue } from "@/lib/utils";

const MainDashboard = dynamic(
  () => import('@/components/dashboard/main-dashboard').then(mod => mod.MainDashboard),
  {
    loading: () => <div className="flex-1 p-4 sm:p-6 md:p-8"><p>Carregando dashboard...</p></div>,
    ssr: false
  }
);

export default function Home() {
  const [data, setData] = useState<RowData[] | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [neighborhoodFilter, setNeighborhoodFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    const loadInitialFile = async () => {
      setIsLoading(true);
      const filePath = '/Métricas Agosto 2025.xlsx';
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error('Não foi possível encontrar o arquivo na pasta public.');
        }
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: null });
        
        handleData(jsonData, 'Métricas Agosto 2025.xlsx');

      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao Carregar Arquivo",
          description: error.message || "Não foi possível carregar o arquivo inicial.",
        });
        handleError();
      }
    };

    loadInitialFile();
  }, [toast]);

  const handleData = (parsedJson: any[], name: string) => {
    try {
      const parsedData = parsedJson.map((row: any): RowData => {
        const requiredKeys = ['PDX_LAT', 'PDX_LNG'];
        for(const key of requiredKeys) {
            if(!(key in row)) throw new Error(`Coluna obrigatória ausente: ${key}`);
        }

        const newRow: any = { ...row };
        for (const key in newRow) {
            if(Object.prototype.hasOwnProperty.call(newRow, key)) {
                const value = newRow[key];
                if (typeof value === 'string' && (value.includes(',') || (!isNaN(Number(value)) && value.trim() !== ''))) {
                    if (key === 'PDX_LAT' || key === 'PDX_LNG') {
                        newRow[key] = parseFloat(value.replace(',', '.'));
                    } else if (key !== 'ID' && key !== 'NOME' && key !== 'PDX_ENDERECO' && key !== 'PDX_NUMERO' && key !== 'PDX_BAIRRO' && key !== 'PDX_CIDADE' && key !== 'PDX_ESTADO' && key !== 'PDX_CEP' && !key.startsWith('#')) {
                         newRow[key] = parseValue(value);
                    }
                } else if(typeof value === 'number') {
                  newRow[key] = value;
                }
            }
        }
        
        return newRow as RowData;
      });
      
      setData(parsedData);
      setFileName(name);
      setIsLoading(false);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no Processamento de Dados",
        description: error.message || "Não foi possível processar os dados do arquivo.",
      });
      handleError();
    }
  };


  const handleError = () => {
    setData(null);
    setFileName('');
    setIsLoading(false);
  };

  const handleReset = () => {
    setData(null);
    setFileName('');
    setStateFilter('all');
    setCityFilter('all');
    setNeighborhoodFilter('all');
    
    // Since we want to reload the initial file on reset, we can call useEffect's logic again.
    const loadInitialFile = async () => {
      setIsLoading(true);
      const filePath = '/Métricas Agosto 2025.xlsx';
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error('Não foi possível encontrar o arquivo na pasta public.');
        }
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: null });
        handleData(jsonData, 'Métricas Agosto 2025.xlsx');
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao Carregar Arquivo",
          description: error.message || "Não foi possível carregar o arquivo inicial.",
        });
        handleError();
      }
    };
    loadInitialFile();
  };

  const handleStateChange = (state: string) => {
    setStateFilter(state);
    setCityFilter('all');
    setNeighborhoodFilter('all');
  };

  const handleCityChange = (city: string) => {
    setCityFilter(city);
    setNeighborhoodFilter('all');
  };

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(row => {
      const stateMatch = stateFilter === 'all' || row.PDX_ESTADO === stateFilter;
      const cityMatch = cityFilter === 'all' || row.PDX_CIDADE === cityFilter;
      const neighborhoodMatch = neighborhoodFilter === 'all' || row.PDX_BAIRRO === neighborhoodFilter;
      return stateMatch && cityMatch && neighborhoodMatch;
    });
  }, [data, stateFilter, cityFilter, neighborhoodFilter]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <DashboardHeader fileName={fileName} onReset={handleReset} hasData={!!data} />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {isLoading || !data ? (
          <div className="flex items-center justify-center h-full max-w-2xl mx-auto">
            <p>Carregando dashboard...</p>
          </div>
        ) : (
          <MainDashboard
            fullData={data}
            filteredData={filteredData}
            onStateChange={handleStateChange}
            onCityChange={handleCityChange}
            onNeighborhoodChange={setNeighborhoodFilter}
            filters={{ state: stateFilter, city: cityFilter, neighborhood: neighborhoodFilter }}
          />
        )}
      </main>
    </div>
  );
}
