"use client";

import { useState } from "react";
import { DataUpload } from "@/components/dashboard/data-upload";
import { MainDashboard } from "@/components/dashboard/main-dashboard";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import type { RowData } from "@/lib/types";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const GeoMap = dynamic(() => import("@/components/dashboard/geo-map").then((mod) => mod.GeoMap), {
  ssr: false,
  loading: () => (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Visualização Geográfica</CardTitle>
        <CardDescription>Carregando mapa...</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Skeleton className="w-full h-full rounded-lg" />
      </CardContent>
    </Card>
  ),
});


export default function Home() {
  const [data, setData] = useState<RowData[] | null>(null);
  const [csvString, setCsvString] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDataUploaded = (
    parsedData: RowData[],
    rawCsv: string,
    name: string
  ) => {
    setData(parsedData);
    setCsvString(rawCsv);
    setFileName(name);
    setIsLoading(false);
  };

  const handleError = () => {
    setData(null);
    setCsvString('');
    setFileName('');
    setIsLoading(false);
  };

  const handleReset = () => {
    setData(null);
    setCsvString('');
    setFileName('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <DashboardHeader fileName={fileName} onReset={handleReset} hasData={!!data} />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {!data ? (
          <div className="flex items-start md:items-center justify-center h-full max-w-2xl mx-auto pt-16 md:pt-0">
            <DataUpload
              onDataUploaded={handleDataUploaded}
              onError={handleError}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <MainDashboard data={data} csvString={csvString} GeoMapComponent={GeoMap} />
        )}
      </main>
    </div>
  );
}
