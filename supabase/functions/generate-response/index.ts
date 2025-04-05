
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openaiApiKey = Deno.env.get("OPENAI_API_KEY")!;
const openaiBaseUrl = Deno.env.get("OPENAI_BASE_URL") || "https://beta.sree.shop/v1";
const openaiModel = Deno.env.get("OPENAI_MODEL") || "Provider-5/gpt-4o";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, tone, relationship, scenario } = await req.json();

    // Create system prompt based on tone, relationship and scenario
    let systemPrompt = `You are Glycos, an AI communication assistant that helps craft messages in the "${tone}" tone.`;
    
    if (relationship) {
      systemPrompt += ` The message is being sent to a ${relationship}.`;
    }
    
    if (scenario) {
      systemPrompt += ` The communication scenario is: ${scenario}.`;
    }
    
    systemPrompt += ` Your goal is to help the user communicate effectively while maintaining the specified tone.`;

    const response = await fetch(`${openaiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: openaiModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    
    // Log any errors for debugging purposes
    if (!response.ok) {
      console.error("OpenAI API Error:", data);
      return new Response(
        JSON.stringify({ 
          error: "Failed to generate response", 
          details: data 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const generatedContent = data.choices[0]?.message?.content || "I couldn't generate a response at this time.";

    return new Response(
      JSON.stringify({ 
        content: generatedContent,
        model: openaiModel,
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error processing request:", error.message);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
