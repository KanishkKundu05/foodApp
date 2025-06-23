import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// This is the fix: Force the API to run on the more robust Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const generationPrompt = `You are 'SousAI', a world-class AI sous-chef, designed to act as a friendly, knowledgeable, and encouraging cooking partner. Your primary goal is to have a natural, free-flowing conversation to help a user decide what to cook. When the user is happy with the recipe and wants to save it, you MUST respond with a valid JSON object in this exact format:

{
  "title": "Recipe Title",
  "description": "A brief description of the recipe",
  "ingredients": [
    { "name": "Ingredient 1", "amount": "1 cup" },
    { "name": "Ingredient 2", "amount": "2 tablespoons" }
  ],
  "instructions": [
    "Step 1 instruction",
    "Step 2 instruction"
  ],
  "prep_time": 15,
  "cook_time": 30,
  "servings": 4,
  "notes": {
    "emoji": "🍳",
    "text": "Any special notes or tips"
  }
}

The JSON must be wrapped in markdown code block with json language specifier, like this:
\`\`\`json
{
  // recipe json here
}
\`\`\`
`;

const cookingPrompt = `You are the 'SousAI Cooking Assistant'. You are a calm, expert, and reassuring guide.
The user is cooking a recipe they previously created with you. You have been provided the full chat history of the recipe's creation.

**Your Core Job:**
1.  **Act as a Guide:** Reference the original conversation and the provided recipe notes to guide them. Use phrases like, "Remember we decided to..." or "The notes mention you liked it spicy, so let's...".
2.  **Be Conversational:** Provide clear, step-by-step instructions. Answer questions about substitutions, timings, or techniques.
3.  **Stay in Character:** You are an assistant, not a generator. NEVER output JSON or code. Your responses should be conversational text ONLY. Be helpful and encouraging.

**Example Interaction:**
User: "I'm making this again. How much chili flakes did we decide to use?"
You: "Fantastic! I'm thrilled you enjoyed it. Looking back at our notes, we decided on a full teaspoon of chili flakes because you mentioned you like it spicy. Are you ready to get started with the first step?"`;

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { messages, chatMode, userId } = await req.json();

    // Verify user authentication using the Supabase cookie
    const cookieStore = await cookies();
    const supabaseAuthCookie = await cookieStore.get('sb-access-token');
    
    if (!supabaseAuthCookie?.value) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Set up auth context
    const { data: { user }, error: authError } = await supabase.auth.getUser(supabaseAuthCookie.value);
    
    if (authError || !user || user.id !== userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get user's chat history from Supabase
    const { data: chatHistory } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .eq('session_id', messages[0]?.id?.split(':')[0] || 'new')
      .order('created_at', { ascending: true });

    const systemPrompt = (chatMode === 'cook' || chatMode === 'cooking-help') 
      ? cookingPrompt 
      : generationPrompt;

    const result = await streamText({
      model: openai('gpt-4'),
      system: systemPrompt,
      messages: [
        ...messages,
        ...(chatHistory?.map(msg => ({
          role: msg.role,
          content: msg.content,
        })) || []),
      ],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('[CHEF API] Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
