"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type FilterControlsProps = {
  filterType: string;
  activeFilter: string | null;
  onClearFilter: () => void;
  defaultDescription: string;
};

export function FilterControls({
  filterType,
  activeFilter,
  onClearFilter,
  defaultDescription,
}: FilterControlsProps) {
  if (!activeFilter) {
    return <span>{defaultDescription}</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <span>Filtrando por {filterType}:</span>
      <Badge variant="secondary" className="gap-1.5">
        {activeFilter}
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onClearFilter();
          }}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Limpar filtro</span>
        </Button>
      </Badge>
    </div>
  );
}
