import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ATROUN_KNOWLEDGE_BASE = `
# ATROUN BioDynamics - Company Knowledge Base

## About ATROUN
ATROUN BioDynamics is a Uganda-based agribusiness pioneering a circular biorefinery model that uses lyophilization (freeze-drying) to stabilize agricultural biomass and convert fresh agricultural produce into high-value, long-lasting products. They also produce biochar to convert organic residues into carbon-stable soil enhancers — facilitating climate resilience, economic empowerment, and community transformation.

**Location:** Kampala, Uganda

## Mission & Vision
**Mission:** To build a globally recognized brand in the lyophilized food and cosmetic sectors by offering high-quality, preservative-free products, while fostering sustainable agricultural practices in Uganda.

**Vision:** To become a leading African producer of high-quality freeze-dried food and cosmetic ingredients for global markets.

## Core Technology - Lyophilization (Freeze-Drying)
Freeze-drying is a modern food preservation method that removes water at very low temperatures. This allows food to:
- Keep its nutritional value, taste, and colour
- Last months or years without refrigeration
- Become lightweight and easy to transport
- Retain over 95% of nutrients compared to traditional drying methods

Compared to traditional drying or freezing, freeze-drying produces a premium product that sells at higher prices and travels easily to international markets.

## The Problem ATROUN Solves
- Agriculture employs over 70% of Uganda's population
- More than 30-40% of perishable food is lost after harvest
- Most exports are raw or minimally processed, earning low returns
- Avocados are particularly vulnerable due to high perishability, seasonal production peaks, limited processing alternatives

## Products & Services

### Primary Products:
1. **Freeze-Dried Avocado Products**
   - Avocado powder for food, pharmaceutical, and cosmetic applications
   - Freeze-dried avocado slices for snacks and food manufacturing

2. **Freeze-Dried Sweet Potato Products**
   - High-nutrient sweet potato flour for baby food and gluten-free products
   - Freeze-dried sweet potato chips for the snack industry

3. **Functional Ingredients & By-products**
   - Avocado seed extract (nutraceuticals, supplements)
   - Avocado oil (cosmetics, pharmaceuticals)
   - Avocado skin extracts (natural dyes, antioxidant-rich compounds)
   - Biomass for animal feed, biofuel, and fertilizer

### Biochar Production
Organic residues from processing are converted into biochar through controlled pyrolysis. Biochar is a carbon-stable soil amendment that improves soil structure, water retention, and nutrient efficiency.

## Target Markets

### B2B Segment (Primary Focus):
- **Food & Beverage Industry:** Manufacturers of health foods, baby food, bakery ingredients, and sports nutrition products
- **Pharmaceutical Industry:** Producers of functional food supplements and nutraceuticals
- **Cosmetic & Skincare Industry:** Manufacturers of natural skin and hair care products

### Geographic Markets:
- Europe (primary export target)
- North America
- Middle East
- Africa (regional markets)

## Business Model & Value Proposition
1. **Reduction of Post-Harvest Losses** – Preserving Uganda's fresh produce through advanced freeze-drying technology
2. **Premium, Nutrient-Rich Products** – Superior food preservation with over 90% nutrient retention
3. **Economic Empowerment** – Creating new revenue streams for Ugandan farmers
4. **Sustainability & Circular Economy** – Utilizing biomass residues for secondary product lines
5. **Zero-Waste Integration** – All residues become value through biochar production

## Financial Highlights (36-Month Projection)
- **Pre-Seed Validation (0-6 months):** $50,000 - POC, Lab trials, LOIs
- **Seed Close & Procurement (6-9 months):** $400,000 - Order equipment, hire core team
- **Equipment Delivery + Pilot (9-12 months):** $350,000 - Install equipment, pilot run
- **Certifications & First Sales (12-18 months):** $300,000 - Certifications, first exports
- **Scale to Commercial Capacity (18-30 months):** $200,000 - Ramp up production

**Target Gross Profit Margin:** 30-50%
**Projected Break-even:** Q1 Year 3

## Competitive Advantages
1. First-mover advantage in East African lyophilization
2. Vertically integrated supply chain
3. Access to abundant, low-cost raw materials
4. Uganda's favorable climate and trade agreements
5. Circular economy model creating multiple revenue streams
6. Modular, scalable processing infrastructure

## Sustainability Impact
- Reduces post-harvest food losses (30-40% currently lost)
- Creates carbon-negative operations through biochar production
- Supports smallholder farmers with stable income
- Reduces cold-chain logistics emissions
- Plans to onboard 1,000+ smallholder farmers

## Key Partners
- Smallholder farmers and cooperatives
- Uganda Investment Authority
- Ministry of Agriculture
- Makerere University Agricultural Research Institute
- Uganda Export Promotion Board
- UNBS (Uganda National Bureau of Standards)

## Leadership
- **Founder:** Martin Mwangi
- Company operates as a Limited Liability Company (LLC) in Uganda

## Business Objectives
1. Build a profitable freeze-drying operation serving food, cosmetic, and pharmaceutical markets
2. Reduce post-harvest food losses by processing surplus produce
3. Establish long-term export contracts in Europe, North America, the Middle East, and Africa
4. Expand product lines beyond avocados into fruits, herbs, and roots
5. Achieve 20% reduction in carbon footprint through sustainable manufacturing practices

## Key Performance Indicators
- Quantity of produce processed per month
- Yield efficiency (target: above 95%)
- Cost per kg of finished product
- Annual revenue growth
- Export volumes
- Number of active international buyers
- Reduction in food waste
- Number of farmers supported

## Contact
For partnership inquiries, investment opportunities, or general questions, please use the contact form on our website.
`;

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  fr: 'French',
  es: 'Spanish',
  de: 'German',
  pt: 'Portuguese',
  ru: 'Russian',
  sw: 'Swahili',
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, targetLanguage } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const languageInstructions = targetLanguage && targetLanguage !== 'en' 
      ? `\n\nIMPORTANT: Respond ENTIRELY in ${LANGUAGE_NAMES[targetLanguage] || targetLanguage}. Translate your response naturally.`
      : '';

    const systemPrompt = `You are the ATROUN BioDynamics AI Assistant, a knowledgeable representative of ATROUN BioDynamics, a pioneering agribusiness company based in Uganda.

CRITICAL RESPONSE RULES:
- Keep responses BRIEF (2-4 sentences max) unless user explicitly asks for details
- Be direct and to the point
- Only elaborate when asked "tell me more", "explain further", etc.
${languageInstructions}

Your role is to:
1. Answer questions about ATROUN BioDynamics, products, technology, mission
2. Explain lyophilization (freeze-drying) in simple terms
3. Discuss sustainability initiatives
4. Provide investment/partnership information

Here is your knowledge base:

${ATROUN_KNOWLEDGE_BASE}

Remember: Brief, accurate, professional.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("company-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
