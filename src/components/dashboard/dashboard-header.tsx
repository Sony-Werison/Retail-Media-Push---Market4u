"use client";

import { LoganLogo } from "./logan-logo";

type DashboardHeaderProps = {
  fileName: string;
  hasData: boolean;
};

export function DashboardHeader({ fileName, hasData }: DashboardHeaderProps) {
  const title = fileName.replace(/\.[^/.]+$/, "");
  
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-card border-t-4 border-primary shrink-0 sm:px-6">
      <div className="flex items-center gap-4">
        <LoganLogo className="h-6" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Retail Media Push
          </h1>
          <p className="text-sm text-muted-foreground -mt-1">powered by Market4u</p>
        </div>
      </div>
      {hasData && (
        <div className="flex items-center gap-2">
           <div className="hidden items-center gap-2 text-base font-medium p-2 rounded-md sm:flex">
            <span>{title}</span>
           </div>
        </div>
      )}
    </header>
  );
}
