'use server';
/**
 * @fileOverview A marketing content generation AI agent.
 *
 * - generateMarketingContent - A function that handles the marketing content generation process.
 * - GenerateMarketingContentInput - The input type for the generateMarketingContent function.
 * - GenerateMarketingContentOutput - The return type for the generateMarketingContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketingContentTypeSchema = z.union([
  z.literal('product_description'),
  z.literal('social_media_post'),
  z.literal('email_newsletter_snippet'),
  z.literal('website_banner_copy')
]);

const GenerateMarketingContentInputSchema = z.object({
  contentType: MarketingContentTypeSchema.describe('The type of marketing content to generate (e.g., product_description, social_media_post).'),
  productName: z.string().describe('The name of the organic product.'),
  keyFeatures: z.array(z.string()).describe('A list of key features or benefits of the product.'),
  targetAudience: z.string().optional().describe('The target audience for this content.'),
  tone: z.string().optional().describe('The desired tone for the content (e.g., persuasive, informative, playful, sophisticated).')
});
export type GenerateMarketingContentInput = z.infer<typeof GenerateMarketingContentInputSchema>;

const GenerateMarketingContentOutputSchema = z.object({
  content: z.string().describe('The generated marketing content.')
});
export type GenerateMarketingContentOutput = z.infer<typeof GenerateMarketingContentOutputSchema>;

export async function generateMarketingContent(input: GenerateMarketingContentInput): Promise<GenerateMarketingContentOutput> {
  return generateMarketingContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMarketingContentPrompt',
  input: {schema: GenerateMarketingContentInputSchema},
  output: {schema: GenerateMarketingContentOutputSchema},
  prompt: `You are an expert marketing copywriter specializing in organic products. Your task is to generate compelling and consistent promotional material based on the provided details.

Generate a {{{contentType}}} for the following organic product:

Product Name: {{{productName}}}
Key Features/Benefits:
{{#each keyFeatures}}- {{{this}}}
{{/each}}
{{#if targetAudience}}Target Audience: {{{targetAudience}}}
{{/if}}{{#if tone}}Desired Tone: {{{tone}}}
{{/if}}
Ensure the content highlights the organic nature and benefits of the product. The output should be ready to use for marketing.`
});

const generateMarketingContentFlow = ai.defineFlow(
  {
    name: 'generateMarketingContentFlow',
    inputSchema: GenerateMarketingContentInputSchema,
    outputSchema: GenerateMarketingContentOutputSchema
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
