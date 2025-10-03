"use client";

import { Button } from "@/components/ui/button";
import { LoganLogo } from "./logan-logo";
import { File, X, Download, Share2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";

type DashboardHeaderProps = {
  fileName: string;
  onReset: () => void;
  hasData: boolean;
};

export function DashboardHeader({ fileName, onReset, hasData }: DashboardHeaderProps) {
  const { toast } = useToast();

  const handleExportToPDF = () => {
    const dashboardElement = document.querySelector<HTMLElement>('.grid.grid-cols-12');
    if (dashboardElement) {
      toast({ title: 'Exportando para PDF...', description: 'Aguarde um momento.' });
      html2canvas(dashboardElement, { scale: 2 }).then((canvas) => {
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

  const handleShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link Copiado!",
        description: "O link de visualização foi copiado para a área de transferência.",
      });
    }).catch(err => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível copiar o link.",
      });
    });
  };


  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-card border-b shrink-0 sm:px-6">
      <div className="flex items-center gap-4">
        <LoganLogo className="h-6" />
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Retail Media Push
          </h1>
          <p className="text-xs text-muted-foreground -mt-1">powered by Market4u</p>
        </div>
      </div>
      {hasData && (
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-md bg-background border">
            <File className="w-4 h-4"/>
            <span className="hidden sm:inline">{fileName}</span>
           </div>
          <Button variant="ghost" size="icon" onClick={handleExportToPDF} aria-label="Export to PDF">
            <Download className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShareLink} aria-label="Share link">
            <Share2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onReset} aria-label="Clear data">
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}
    </header>
  );
}
