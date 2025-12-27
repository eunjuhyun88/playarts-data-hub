import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, action, userMessage } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Dataset assistant action:', action);

    let systemPrompt = `You are an expert AI training data specialist. Your role is to help users optimize their datasets for fine-tuning language models.

You analyze data quality, suggest improvements, identify issues, and help create high-quality training datasets.

Be concise, actionable, and specific in your recommendations. Format your responses with clear sections using markdown.`;

    let userContent = '';

    if (action === 'analyze') {
      userContent = `Analyze this dataset for training quality. Identify:
1. Overall quality assessment
2. Potential issues (duplicates, low-quality items, inconsistencies)
3. Distribution analysis (types, complexity, topics)
4. Specific recommendations for improvement

Dataset (${items.length} items):
${JSON.stringify(items.slice(0, 10), null, 2)}
${items.length > 10 ? `\n... and ${items.length - 10} more items` : ''}`;

    } else if (action === 'suggest-improvements') {
      userContent = `Suggest specific improvements for these training data items. For each issue found, provide:
1. The problem
2. Why it matters for training
3. How to fix it

Items to review:
${JSON.stringify(items.slice(0, 5), null, 2)}`;

    } else if (action === 'generate-pairs') {
      userContent = `Based on these items, suggest additional instruction-response pairs that would complement this dataset. Generate 3-5 high-quality examples that:
1. Fill gaps in the current data
2. Increase diversity
3. Cover edge cases

Current items:
${JSON.stringify(items.slice(0, 5), null, 2)}`;

    } else if (action === 'chat' && userMessage) {
      userContent = `User has ${items.length} items selected in their dataset.

Sample of their data:
${JSON.stringify(items.slice(0, 3), null, 2)}

User question: ${userMessage}

Provide helpful, specific advice related to their dataset and question.`;

    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action or missing parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add more credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('No response from AI');
    }

    console.log('Assistant response length:', assistantMessage.length);

    return new Response(
      JSON.stringify({ success: true, message: assistantMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in dataset-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
