import { NewsCard } from "./components/NewsCard";
import { getFeed, NewsItem } from "./lib/feed";

// ISR: Revalidate every 10 minutes
export const revalidate = 600;

export default async function Home() {
  let newsItems: NewsItem[] = [];
  let error: string | null = null;

  try {
    newsItems = await getFeed();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load feed";
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Prediction News
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            What if predictions were reality?
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {error ? (
          <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        ) : newsItems.length === 0 ? (
          <div className="py-12 text-center text-zinc-500">
            Loading predictions...
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {newsItems.map((item) => (
              <NewsCard
                key={item.id}
                headline={item.headline}
                body={item.body}
                image={item.image}
                probability={item.probability}
                originalMarket={item.originalMarket}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-200 py-8 dark:border-zinc-800">
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Powered by{" "}
          <a
            href="https://polymarket.com"
            className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Polymarket
          </a>{" "}
          data
        </p>
      </footer>
    </div>
  );
}
