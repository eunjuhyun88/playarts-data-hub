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
    const { content, type } = await req.json();
    
    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Classifying content:', content.substring(0, 100) + '...');

    const systemPrompt = `You are a data classification expert for AI training datasets. Analyze the given content and return a JSON classification.

For CODE snippets, identify:
- Primary language (typescript, python, javascript, sql, yaml, etc.)
- Category (authentication, api, database, ui-component, algorithm, config, utility, etc.)
- Quality score (1-10 based on completeness, best practices, readability)
- Suggested tags (2-5 relevant tags)

For PROMPTS, identify:
- Domain (coding, creative, analysis, documentation, explanation, etc.)
- Complexity (simple, moderate, complex)
- Quality score (1-10 based on clarity, specificity, actionability)
- Suggested tags (2-5 relevant tags)

Always respond with valid JSON only, no markdown formatting.`;

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
          { role: 'user', content: `Classify this ${type || 'content'}:\n\n${content}` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "classify_content",
              description: "Classify and tag the content for AI training datasets",
              parameters: {
                type: "object",
                properties: {
                  category: { type: "string", description: "Primary category of the content" },
                  language: { type: "string", description: "Programming language if code, or 'prompt' for prompts" },
                  domain: { type: "string", description: "Domain or subject area" },
                  complexity: { type: "string", enum: ["simple", "moderate", "complex"] },
                  qualityScore: { type: "number", description: "Quality score from 1-10" },
                  tags: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "2-5 relevant tags"
                  },
                  summary: { type: "string", description: "One-line summary of the content" }
                },
                required: ["category", "qualityScore", "tags", "summary"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "classify_content" } }
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
    console.log('AI response:', JSON.stringify(data));

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const classification = JSON.parse(toolCall.function.arguments);
      console.log('Classification result:', classification);
      return new Response(
        JSON.stringify({ success: true, classification }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fallback: try to parse content directly
    const content_response = data.choices?.[0]?.message?.content;
    if (content_response) {
      try {
        const classification = JSON.parse(content_response);
        return new Response(
          JSON.stringify({ success: true, classification }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch {
        console.log('Could not parse response as JSON');
      }
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Could not classify content' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in classify-data function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
