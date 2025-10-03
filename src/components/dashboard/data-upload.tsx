"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Loader2 } from "lucide-react";
import { cn, parseCountValue } from "@/lib/utils";
import { RowData } from "@/lib/types";

type DataUploadProps = {
  onDataUploaded: (data: RowData[], csvString: string, fileName: string) => void;
  onError: () => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
};

const validFileTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
];

export function DataUpload({ onDataUploaded, onError, setIsLoading, isLoading }: DataUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleData = (data: any[], csvString: string, fileName: string) => {
    try {
      const parsedData = data.map((row: any): RowData => {
        const requiredKeys = ['PDX_LAT', 'PDX_LNG'];
        for(const key of requiredKeys) {
            if(!(key in row)) throw new Error(`Coluna obrigatória ausente: ${key}`);
        }

        return {
          ...row,
          PDX_LAT: parseFloat(String(row.PDX_LAT).replace(',', '.')),
          PDX_LNG: parseFloat(String(row.PDX_LNG).replace(',', '.')),
          'Alcance Geral Target': parseCountValue(row['Alcance Geral Target']),
          'Frequência Média': parseFloat(String(row['Frequência Média']).replace(',', '.')) || 0,
          'Impactos Gerais': parseCountValue(row['Impactos Gerais']),
          'Gênero (Masculino)': parseCountValue(row['Gênero (Masculino)']),
          'Gênero (Feminino)': parseCountValue(row['Gênero (Feminino)']),
          'Faixa Etária (18_24)': parseCountValue(row['Faixa Etária (18_24)']),
          'Faixa Etária (25_29)': parseCountValue(row['Faixa Etária (25_29)']),
          'Faixa Etária (30_39)': parseCountValue(row['Faixa Etária (30_39)']),
          'Faixa Etária (40_49)': parseCountValue(row['Faixa Etária (40_49)']),
          'Faixa Etária (50_59)': parseCountValue(row['Faixa Etária (50_59)']),
          'Faixa Etária (60_69)': parseCountValue(row['Faixa Etária (60_69)']),
          'Faixa Etária (70+)': parseCountValue(row['Faixa Etária (70+)']),
          'Nível Socioeconômico (A)': parseCountValue(row['Nível Socioeconômico (A)']),
          'Nível Socioeconômico (B)': parseCountValue(row['Nível Socioeconômico (B)']),
          'Nível Socioeconômico (C)': parseCountValue(row['Nível Socioeconômico (C)']),
          'Nível Socioeconômico (D)': parseCountValue(row['Nível Socioeconômico (D)']),
          'Nível Socioeconômico (E)': parseCountValue(row['Nível Socioeconômico (E)']),
          'Plataforma (ios)': parseCountValue(row['Plataforma (ios)']),
          'Plataforma (Android)': parseCountValue(row['Plataforma (Android)']),
        };
      });
      onDataUploaded(parsedData, csvString, fileName);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no Processamento de Dados",
        description: error.message || "Não foi possível processar os dados do arquivo. Verifique o formato do arquivo.",
      });
      onError();
    }
  };

  const processFile = useCallback((file: File) => {
    if (!file) return;

    if (!validFileTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Tipo de Arquivo Inválido",
        description: "Faça o upload de um arquivo CSV ou XLSX válido.",
      });
      onError();
      return;
    }
    
    setIsLoading(true);

    const reader = new FileReader();
    
    if (file.type === "text/csv") {
        reader.onload = (e) => {
            const csvString = e.target?.result as string;
            Papa.parse<any>(csvString, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => {
                if (results.errors.length > 0) {
                  toast({
                    variant: "destructive",
                    title: "Erro ao Analisar CSV",
                    description: results.errors.map(e => e.message).join(', '),
                  });
                  onError();
                  return;
                }
                handleData(results.data, csvString, file.name);
              },
            });
        };
        reader.readAsText(file);
    } else { // Handle XLSX
        reader.onload = (e) => {
            const arrayBuffer = e.target?.result;
            const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            const csvString = XLSX.utils.sheet_to_csv(worksheet);
            handleData(json, csvString, file.name);
        };
        reader.readAsArrayBuffer(file);
    }

  }, [onDataUploaded, onError, toast, setIsLoading]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  return (
    <Card className="w-full text-center">
      <CardHeader>
        <CardTitle>Carregue Seus Dados</CardTitle>
        <CardDescription>Arraste e solte seu arquivo CSV ou XLSX aqui ou clique para procurar.</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-12 transition-colors duration-200",
            isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
          )}
        >
          <div className="flex flex-col items-center gap-4">
            {isLoading ? (
              <>
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-muted-foreground">Processando seu arquivo...</p>
              </>
            ) : (
                <>
                <UploadCloud className="h-12 w-12 text-muted-foreground group-hover:text-primary" />
                <p className="text-muted-foreground">
                    <span className="text-primary font-semibold">Clique para carregar</span> ou arraste e solte
                </p>
                <p className="text-xs text-muted-foreground">Apenas arquivos CSV ou XLSX</p>
                <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => e.target.files && processFile(e.target.files[0])}
                />
                 <Button asChild variant="outline" size="sm">
                    <label htmlFor="file-upload">Procurar Arquivo</label>
                </Button>
                </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
