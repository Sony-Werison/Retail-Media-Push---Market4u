import { Button } from "@/components/ui/button";
import { LoganLogo } from "./logan-logo";
import { File, X } from "lucide-react";

type DashboardHeaderProps = {
  fileName: string;
  onReset: () => void;
  hasData: boolean;
};

export function DashboardHeader({ fileName, onReset, hasData }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-card border-b shrink-0 sm:px-6">
      <div className="flex items-center gap-3">
        <LoganLogo className="w-8 h-8" />
        <h1 className="text-xl font-semibold tracking-tight">
          Logan Dashboard
        </h1>
      </div>
      {hasData && (
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-md bg-background border">
            <File className="w-4 h-4"/>
            <span className="hidden sm:inline">{fileName}</span>
           </div>
          <Button variant="ghost" size="icon" onClick={onReset} aria-label="Clear data">
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}
    </header>
  );
}
