'use server';

/**
 * @fileOverview Generates key insights from uploaded data, focusing on relationships between location, demographics, and brand preferences.
 *
 * - generateDataInsights - A function that generates insights from uploaded data.
 * - GenerateDataInsightsInput - The input type for the generateDataInsights function.
 * - GenerateDataInsightsOutput - The return type for the generateDataInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDataInsightsInputSchema = z.object({
  csvData: z.string().describe('Dados em CSV contendo localização, demografia e preferências de marca.'),
});
export type GenerateDataInsightsInput = z.infer<typeof GenerateDataInsightsInputSchema>;

const GenerateDataInsightsOutputSchema = z.object({
  insights: z.string().describe('Principais insights e resumos dos dados carregados.'),
});
export type GenerateDataInsightsOutput = z.infer<typeof GenerateDataInsightsOutputSchema>;

export async function generateDataInsights(input: GenerateDataInsightsInput): Promise<GenerateDataInsightsOutput> {
  return generateDataInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDataInsightsPrompt',
  input: {schema: GenerateDataInsightsInputSchema},
  output: {schema: GenerateDataInsightsOutputSchema},
  prompt: `Você é um analista de dados especialista encarregado de extrair insights importantes de dados de clientes.

Você receberá dados em CSV contendo localização, demografia e preferências de marca.

Seu objetivo é identificar as relações mais significativas entre esses fatores e fornecer um resumo conciso de suas descobertas.

Aqui estão os dados CSV:
{{{csvData}}}

Concentre-se em identificar padrões e tendências que seriam valiosos para a estratégia de marketing и negócios.

Produza os insights em um formato claro e de fácil compreensão.
`,
});

const generateDataInsightsFlow = ai.defineFlow(
  {
    name: 'generateDataInsightsFlow',
    inputSchema: GenerateDataInsightsInputSchema,
    outputSchema: GenerateDataInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
