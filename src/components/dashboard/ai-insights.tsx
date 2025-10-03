"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateDataInsights } from "@/ai/flows/generate-data-insights";
import { Wand2, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AIAssistantProps = {
  csvData: string;
};

export function AIAssistant({ csvData }: AIAssistantProps) {
  const [insights, setInsights] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateInsights = async () => {
    setLoading(true);
    setInsights("");
    try {
      const result = await generateDataInsights({ csvData });
      setInsights(result.insights);
    } catch (error) {
      console.error("Error generating insights:", error);
      toast({
        variant: "destructive",
        title: "AI Assistant Error",
        description: "Could not generate insights. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-primary" />
            <CardTitle>AI Insights</CardTitle>
        </div>
        <CardDescription>
          Generate key insights from your data automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center text-center gap-4">
        {loading ? (
          <>
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Analyzing data and generating insights...</p>
          </>
        ) : insights ? (
          <div className="text-left w-full h-64 overflow-y-auto p-4 bg-muted/50 rounded-lg">
            <p className="whitespace-pre-wrap text-sm">{insights}</p>
          </div>
        ) : (
          <>
            <Sparkles className="w-10 h-10 text-muted-foreground" />
            <p className="text-muted-foreground">Click the button to reveal powerful insights about your audience.</p>
          </>
        )}
      </CardContent>
      <div className="p-6 pt-0">
        <Button onClick={handleGenerateInsights} disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            {loading ? "Generating..." : "Generate Insights"}
        </Button>
      </div>
    </Card>
  );
}
