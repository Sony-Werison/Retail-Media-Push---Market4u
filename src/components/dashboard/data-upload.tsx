"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Loader2 } from "lucide-react";
import { cn, parseValue } from "@/lib/utils";
import { RowData } from "@/lib/types";

type DataUploadProps = {
  onDataUploaded: (data: RowData[], fileName: string) => void;
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

  const handleData = (data: any[], fileName: string) => {
    try {
      const parsedData = data.map((row: any): RowData => {
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
      onDataUploaded(parsedData, fileName);
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
                handleData(results.data, file.name);
              },
            });
        };
        reader.readAsText(file, 'ISO-8859-1');
    } else { // Handle XLSX
        reader.onload = (e) => {
            const arrayBuffer = e.target?.result;
            const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: null });
            handleData(json, file.name);
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
