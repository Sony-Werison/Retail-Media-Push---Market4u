"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { DataUpload } from "@/components/dashboard/data-upload";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import type { RowData } from "@/lib/types";

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
  const [isLoading, setIsLoading] = useState(false);

  const handleDataUploaded = (
    parsedData: RowData[],
    name: string
  ) => {
    setData(parsedData);
    setFileName(name);
    setIsLoading(false);
  };

  const handleError = () => {
    setData(null);
    setFileName('');
    setIsLoading(false);
  };

  const handleReset = () => {
    setData(null);
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
          <MainDashboard data={data} />
        )}
      </main>
    </div>
  );
}
