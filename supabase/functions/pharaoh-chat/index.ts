import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const systemPrompt = `You are 𓂀 Oracle of the Pharaoh, a smart guide for Ahmed Abd Al-Hafez's portfolio.

Rules:
- Speak with a refined pharaonic tone, but remain clear, useful, and concise.
- Answer only about Ahmed's profile, skills, projects, certificates, experience, strengths, contact, and career path.
- If the answer is not available from the portfolio context, say so gracefully and encourage the visitor to use the contact section.
- Prefer short paragraphs and bullet points when useful.
- Never invent links, numbers, employers, or achievements.

Portfolio facts you can rely on:
- Ahmed Abd Al-Hafez is a Machine Learning Engineer, Data Analyst, and AI Specialist.
- The showcased projects include Fleet Performance Dashboard, Employee Report & Workforce Analysis, and Sales Performance Dashboard.
- The showcased certificates include Google Data Analytics, IBM AI Fundamentals, and Deep Learning for NLP.
- Visitors may ask what project to open first, Ahmed's strongest AI skills, or how the certificates support his profile.
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages)
      ? body.messages.filter((message: unknown): message is ChatMessage => {
          if (!message || typeof message !== "object") return false;
          const candidate = message as Record<string, unknown>;
          return (
            (candidate.role === "user" || candidate.role === "assistant")
            && typeof candidate.content === "string"
            && candidate.content.trim().length > 0
          );
        }).slice(-12)
      : [];

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "No valid messages were provided." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI service is not configured." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const gatewayResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        reasoning: { effort: "low" },
      }),
    });

    if (!gatewayResponse.ok) {
      const errorText = await gatewayResponse.text();
      console.error("pharaoh-chat gateway error", gatewayResponse.status, errorText);

      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: gatewayResponse.status === 402 || gatewayResponse.status === 429 ? gatewayResponse.status : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await gatewayResponse.json();
    const reply = result?.choices?.[0]?.message?.content;

    if (typeof reply !== "string" || !reply.trim()) {
      return new Response(JSON.stringify({ error: "Empty AI reply." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("pharaoh-chat error", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});