import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { text, userId } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Invalid text provided' }, { status: 400 });
    }

    // Verify user authentication
    const cookieStore = await cookies();
    const supabaseAuthCookie = await cookieStore.get('sb-access-token');
    
    if (!supabaseAuthCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Set up auth context
    const { data: { user }, error: authError } = await supabase.auth.getUser(supabaseAuthCookie.value);
    
    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // This regex is designed to find a JSON object within a string, even if it's wrapped in markdown backticks.
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```|(\{[\s\S]*\})/);

    if (!jsonMatch) {
      return NextResponse.json({ error: 'No valid JSON object found in the text.' }, { status: 400 });
    }

    // It will prioritize the first capturing group (markdown block) if it exists, otherwise it will use the second (raw object).
    const jsonString = jsonMatch[1] || jsonMatch[2];

    if (!jsonString) {
      return NextResponse.json({ error: 'Could not extract JSON string.' }, { status: 400 });
    }

    let parsedJson = JSON.parse(jsonString);

    // The AI often nests the recipe object inside a `recipe` property.
    // We check for that and elevate the nested object to the top level.
    if (parsedJson.recipe) {
      parsedJson = parsedJson.recipe;
    }

    // Basic validation to ensure we have a recipe-like object
    if (!parsedJson.title || !parsedJson.ingredients || !parsedJson.instructions) {
      return NextResponse.json({ error: 'Parsed JSON is not a valid recipe object.' }, { status: 400 });
    }

    // Store the recipe parsing attempt in chat_messages
    await supabase.from('chat_messages').insert({
      user_id: userId,
      session_id: 'recipe-parsing',
      role: 'system',
      content: JSON.stringify(parsedJson),
      recipe_data: parsedJson
    });

    return NextResponse.json(parsedJson);

  } catch (error) {
    console.error('[PARSE RECIPE API] Error:', error);
    let errorMessage = 'Failed to parse recipe.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
