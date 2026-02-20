import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { message, history, documentContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are ATROUN Bio-Dynamics' dedicated financial AI assistant for investors and stakeholders.
    
Your role is to:
- Provide clear, concise answers about ATROUN's financials, operations, and investment opportunity
- Reference uploaded documents when relevant
- Be professional, accurate, and helpful
- Format responses with bullet points and headers for clarity when appropriate
- If asked about documents, help users understand them and offer to explain specific sections
- Keep answers focused and business-relevant (2-5 sentences unless detail is requested)
- You can help users find and download documents by mentioning their titles

ATROUN Bio-Dynamics context:
- Kenyan avocado biorefinery startup
- Specializes in avocado oil and freeze-dried avocado products
- Targets pharmaceutical, nutraceutical, cosmetic, and food markets globally
- Working with smallholder farmers and sustainable practices

${documentContext ? `\nAvailable documents in the system:\n${documentContext}` : ''}

Always maintain confidentiality and only share information that is in the available documents or common knowledge about the company.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history ?? []),
      { role: "user", content: message },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI service requires payment. Contact administrator." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content ?? "I'm unable to generate a response at this time.";

    return new Response(JSON.stringify({ message: assistantMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("investor-chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
