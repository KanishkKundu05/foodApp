import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { ingredients } = await req.json();

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json({ error: 'Ingredients are required' }, { status: 400 });
    }

    const ingredientsText = ingredients.map(i => `${i.amount} ${i.name}`).join(', ');

    const { object: nutritionalInfo } = await generateObject({
      model: openai('gpt-4o'),
      schema: z.object({
        calories: z.number().describe('Estimated total calories for the recipe'),
        protein: z.number().describe('Estimated grams of protein for the recipe'),
        carbs: z.number().describe('Estimated grams of carbohydrates for the recipe'),
        fats: z.number().describe('Estimated grams of fat for the recipe'),
      }),
      prompt: `Estimate the nutritional information (calories, protein, carbs, fat) for a recipe with the following ingredients: ${ingredientsText}. Please provide numerical values only for the entire recipe.`,
    });

    return NextResponse.json(nutritionalInfo);

  } catch (error) {
    console.error('Error getting nutritional info:', error);
    // Return a more informative error response
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to get nutritional information', details: errorMessage }, { status: 500 });
  }
} 