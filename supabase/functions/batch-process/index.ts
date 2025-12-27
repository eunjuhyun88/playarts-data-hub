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
    const { items, options } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!items || items.length === 0) {
      throw new Error("No items provided for processing");
    }

    console.log(`Batch processing ${items.length} items with options:`, options);

    const processedItems = [];

    for (const item of items) {
      const systemPrompt = `You are a data cleaning and formatting AI assistant for machine learning training data.
Your job is to clean and format the given content to make it high-quality training data.

Rules:
1. Fix any syntax errors in code
2. Remove unnecessary comments or debug statements
3. Improve code formatting and indentation
4. For prompts, clarify ambiguous language
5. Remove any PII (emails, names, addresses) if maskPII is enabled
6. Ensure content is well-structured
7. Keep the original intent and meaning intact

Options enabled:
- Mask PII: ${options?.maskPII ?? true}
- Code formatting: ${options?.codeOnly ?? false}
- Remove duplicates: ${options?.removeDuplicates ?? true}

Return ONLY a JSON object with these fields:
{
  "cleanedContent": "the cleaned and formatted content",
  "changes": ["list of changes made"],
  "qualityScore": 0-100
}`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Clean and format this ${item.type}:\n\nTitle: ${item.title}\n\nContent:\n${item.content}` }
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`AI gateway error for item ${item.id}:`, response.status, errorText);
        
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        if (response.status === 402) {
          throw new Error("Payment required. Please add credits to your workspace.");
        }
        
        // Keep original item if processing fails
        processedItems.push({
          ...item,
          cleanedContent: item.content,
          changes: ["Processing failed - kept original"],
          qualityScore: 50
        });
        continue;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (content) {
        try {
          // Try to parse JSON response
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            processedItems.push({
              ...item,
              cleanedContent: parsed.cleanedContent || item.content,
              changes: parsed.changes || [],
              qualityScore: parsed.qualityScore || 75
            });
          } else {
            processedItems.push({
              ...item,
              cleanedContent: content,
              changes: ["Content reformatted"],
              qualityScore: 75
            });
          }
        } catch {
          processedItems.push({
            ...item,
            cleanedContent: content,
            changes: ["Content reformatted"],
            qualityScore: 75
          });
        }
      } else {
        processedItems.push({
          ...item,
          cleanedContent: item.content,
          changes: ["No changes needed"],
          qualityScore: 80
        });
      }
    }

    console.log(`Successfully processed ${processedItems.length} items`);

    return new Response(JSON.stringify({ 
      success: true, 
      items: processedItems,
      summary: {
        total: items.length,
        processed: processedItems.length,
        avgQualityScore: Math.round(processedItems.reduce((sum, i) => sum + (i.qualityScore || 0), 0) / processedItems.length)
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Batch process error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
