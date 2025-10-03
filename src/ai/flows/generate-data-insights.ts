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
  csvData: z.string().describe('CSV data containing location, demographics, and brand preferences.'),
});
export type GenerateDataInsightsInput = z.infer<typeof GenerateDataInsightsInputSchema>;

const GenerateDataInsightsOutputSchema = z.object({
  insights: z.string().describe('Key insights and summaries from the uploaded data.'),
});
export type GenerateDataInsightsOutput = z.infer<typeof GenerateDataInsightsOutputSchema>;

export async function generateDataInsights(input: GenerateDataInsightsInput): Promise<GenerateDataInsightsOutput> {
  return generateDataInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDataInsightsPrompt',
  input: {schema: GenerateDataInsightsInputSchema},
  output: {schema: GenerateDataInsightsOutputSchema},
  prompt: `You are an expert data analyst tasked with extracting key insights from customer data.

You will be provided with CSV data containing location, demographics, and brand preferences.

Your goal is to identify the most significant relationships between these factors and provide a concise summary of your findings.

Here is the CSV data:
{{{csvData}}}

Focus on identifying patterns and trends that would be valuable for marketing and business strategy.

Output the insights in a clear and easily understandable format.
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
