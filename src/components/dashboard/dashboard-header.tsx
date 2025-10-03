"use client";

import { Button } from "@/components/ui/button";
import { LoganLogo } from "./logan-logo";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";

type DashboardHeaderProps = {
  fileName: string;
  hasData: boolean;
};

export function DashboardHeader({ fileName, hasData }: DashboardHeaderProps) {
  const { toast } = useToast();
  
  const title = fileName.replace(/\.[^/.]+$/, "");

  const handleExportToPDF = () => {
    const dashboardElement = document.querySelector<HTMLElement>('.grid.grid-cols-12');
    if (dashboardElement) {
      toast({ title: 'Exportando para PDF...', description: 'Aguarde um momento.' });
      
      html2canvas(dashboardElement, { 
        scale: 2,
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save("dashboard.pdf");
        toast({ title: 'Sucesso!', description: 'O download do seu PDF foi iniciado.' });
      }).catch(err => {
        toast({ variant: 'destructive', title: 'Erro ao exportar', description: 'Não foi possível gerar o PDF.' });
        console.error(err);
      });
    }
  };
  
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-card border-b border-t-4 border-primary shrink-0 sm:px-6">
      <div className="flex items-center gap-4">
        <LoganLogo className="h-6" />
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Retail Media Push
          </h1>
          <p className="text-xs text-muted-foreground -mt-1">powered by Market4u</p>
        </div>
      </div>
      {hasData && (
        <div className="flex items-center gap-2">
           <div className="hidden items-center gap-2 text-sm font-medium p-2 rounded-md sm:flex">
            <span>{title}</span>
           </div>
          <Button variant="ghost" size="icon" onClick={handleExportToPDF} aria-label="Export to PDF">
            <Download className="w-5 h-5" />
          </Button>
        </div>
      )}
    </header>
  );
}
