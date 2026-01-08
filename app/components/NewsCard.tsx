import Image from "next/image";

interface NewsCardProps {
  headline: string;
  body: string;
  image: string;
  probability: number;
  originalMarket: {
    title: string;
    slug: string;
  };
}

export function NewsCard({
  headline,
  body,
  image,
  probability,
  originalMarket,
}: NewsCardProps) {
  const polymarketUrl = `https://polymarket.com/event/${originalMarket.slug}`;

  return (
    <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      {image && (
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={image}
            alt={headline}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
          />
          <div className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
            {probability}%
          </div>
        </div>
      )}
      <div className="p-5">
        <h2 className="mb-2 text-xl font-bold leading-tight text-zinc-900 dark:text-zinc-50">
          {headline}
        </h2>
        <p className="mb-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {body}
        </p>
        <a
          href={polymarketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View on Polymarket
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </article>
  );
}
