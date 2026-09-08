import { getDatabase } from "@/db/client";
import { migrateV3 } from "@/db/migrations/v3";

const DAILY_QUOTE_URL = "https://zenquotes.io/api/today";
const REQUEST_TIMEOUT_MS = 8_000;

export type MotivationalQuote = {
  quote: string;
  author: string;
};

type QuoteRow = MotivationalQuote & { date: string };
type ZenQuoteResponse = { q?: unknown; a?: unknown };

const fallbackQuote: MotivationalQuote = {
  quote: "Small steps, repeated consistently, create meaningful change.",
  author: "Ritmo",
};

function getLocalDateKey(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

async function findCachedQuote(date?: string): Promise<MotivationalQuote | null> {
  const db = await getDatabase();
  const row = date
    ? await db.getFirstAsync<QuoteRow>(
        "SELECT date, quote, author FROM daily_quote_cache WHERE date = ?",
        date,
      )
    : await db.getFirstAsync<QuoteRow>(
        "SELECT date, quote, author FROM daily_quote_cache ORDER BY date DESC LIMIT 1",
      );

  return row ? { quote: row.quote, author: row.author } : null;
}

async function fetchDailyQuote(): Promise<MotivationalQuote> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(DAILY_QUOTE_URL, { signal: controller.signal });
    if (!response.ok) throw new Error("ZenQuotes returned " + response.status);

    const payload: unknown = await response.json();
    const item = Array.isArray(payload) ? (payload[0] as ZenQuoteResponse) : null;
    if (!item || typeof item.q !== "string" || typeof item.a !== "string") {
      throw new Error("ZenQuotes returned an invalid response");
    }

    return { quote: item.q.trim(), author: item.a.trim() };
  } finally {
    clearTimeout(timeout);
  }
}

export async function getDailyQuote(): Promise<MotivationalQuote> {
  try {
    // Fast Refresh can preserve a connection opened before the latest migration.
    await migrateV3(await getDatabase());

    const date = getLocalDateKey();
    const cachedToday = await findCachedQuote(date);
    if (cachedToday) return cachedToday;

    try {
      const quote = await fetchDailyQuote();
      const db = await getDatabase();
      await db.runAsync(
        "INSERT OR REPLACE INTO daily_quote_cache " +
          "(date, quote, author, fetched_at) VALUES (?, ?, ?, ?)",
        date,
        quote.quote,
        quote.author,
        Date.now(),
      );
      return quote;
    } catch {
      return (await findCachedQuote()) ?? fallbackQuote;
    }
  } catch {
    return fallbackQuote;
  }
}
