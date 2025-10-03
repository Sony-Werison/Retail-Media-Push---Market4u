"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Loader2, FileCheck2 } from "lucide-react";
import { cn, parseCountValue } from "@/lib/utils";
import { RowData } from "@/lib/types";

type DataUploadProps = {
  onDataUploaded: (data: RowData[], csvString: string, fileName: string) => void;
  onError: () => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
};

export function DataUpload({ onDataUploaded, onError, setIsLoading, isLoading }: DataUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const processFile = useCallback((file: File) => {
    if (!file) return;

    if (file.type !== "text/csv") {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a valid CSV file.",
      });
      onError();
      return;
    }
    
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
        const csvString = e.target?.result as string;
        Papa.parse<any>(csvString, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              toast({
                variant: "destructive",
                title: "Error Parsing CSV",
                description: results.errors.map(e => e.message).join(', '),
              });
              onError();
              return;
            }

            try {
              const parsedData = results.data.map((row: any): RowData => {
                const requiredKeys = ['PDX_LAT', 'PDX_LNG'];
                for(const key of requiredKeys) {
                    if(!(key in row)) throw new Error(`Missing required column: ${key}`);
                }

                return {
                  ...row,
                  PDX_LAT: parseFloat(row.PDX_LAT.replace(',', '.')),
                  PDX_LNG: parseFloat(row.PDX_LNG.replace(',', '.')),
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
              onDataUploaded(parsedData, csvString, file.name);
            } catch (error: any) {
              toast({
                variant: "destructive",
                title: "Data Processing Error",
                description: error.message || "Could not process the CSV data. Please check the file format.",
              });
              onError();
            }
          },
        });
    };
    reader.readAsText(file);

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
        <CardTitle>Upload Your Data</CardTitle>
        <CardDescription>Drag and drop your CSV file here or click to browse.</CardDescription>
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
                <p className="text-muted-foreground">Processing your file...</p>
              </>
            ) : (
                <>
                <UploadCloud className="h-12 w-12 text-muted-foreground group-hover:text-primary" />
                <p className="text-muted-foreground">
                    <span className="text-primary font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">CSV files only</p>
                <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".csv"
                    onChange={(e) => e.target.files && processFile(e.target.files[0])}
                />
                 <Button asChild variant="outline" size="sm">
                    <label htmlFor="file-upload">Browse File</label>
                </Button>
                </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
