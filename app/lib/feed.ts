import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface PolymarketEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  markets: {
    id: string;
    question: string;
    outcomePrices: string;
    outcomes: string;
  }[];
}

export interface NewsItem {
  id: string;
  headline: string;
  body: string;
  image: string;
  probability: number;
  originalMarket: {
    title: string;
    slug: string;
  };
}

async function generateNewsArticle(
  marketTitle: string
): Promise<{ headline: string; body: string }> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a dramatic breaking news writer. Transform prediction market questions into breaking news articles as if the event IS happening RIGHT NOW.

Rules:
- Write as if the predicted event is currently occurring
- Use dramatic, urgent journalistic language
- No hedging words like "might", "could", "if" - state everything as fact
- Keep it concise: one punchy headline and 2-3 sentence body`,
      },
      {
        role: "user",
        content: `Transform this prediction market into breaking news:
"${marketTitle}"

Respond in JSON format:
{"headline": "...", "body": "..."}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.8,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    return { headline: marketTitle, body: "Breaking news developing..." };
  }

  try {
    return JSON.parse(content);
  } catch {
    return { headline: marketTitle, body: "Breaking news developing..." };
  }
}

export async function getFeed(): Promise<NewsItem[]> {
  // Fetch events from Polymarket
  const polymarketResponse = await fetch(
    "https://gamma-api.polymarket.com/events?active=true&closed=false&limit=20",
    { next: { revalidate: 600 } } // Cache for 10 minutes
  );

  if (!polymarketResponse.ok) {
    throw new Error("Failed to fetch from Polymarket");
  }

  const events: PolymarketEvent[] = await polymarketResponse.json();

  // Generate news articles for each event
  const newsItems: NewsItem[] = await Promise.all(
    events.map(async (event) => {
      // Get the primary market's probability
      const market = event.markets?.[0];
      let probability = 50;

      if (market?.outcomePrices) {
        try {
          const prices = JSON.parse(market.outcomePrices);
          probability = Math.round(parseFloat(prices[0]) * 100);
        } catch {
          // Keep default probability
        }
      }

      // Generate news article
      const article = await generateNewsArticle(event.title);

      return {
        id: event.id,
        headline: article.headline,
        body: article.body,
        image: event.image,
        probability,
        originalMarket: {
          title: event.title,
          slug: event.slug,
        },
      };
    })
  );

  return newsItems;
}
