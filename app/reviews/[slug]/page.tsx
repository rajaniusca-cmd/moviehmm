import type { Metadata } from "next";
import { getReview, getAllReviews } from "@/lib/reviews";
import { notFound } from "next/navigation";
import Link from "next/link";

const SITE = "https://www.moviehmm.com";

export function generateStaticParams() {
  return getAllReviews().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const r = getReview(slug);

  if (!r) return {};

  const url = `${SITE}/reviews/${r.slug}`;
  const image = r.poster.startsWith("http")
    ? r.poster
    : `${SITE}${r.poster}`;

  const title = `${r.title} Review (${r.year}) — ${r.score.toFixed(1)}/10`;

  const description =
    `${r.title} review: ${r.dek} MovieHmm rating: ${r.score.toFixed(1)}/10.`;

  return {
    title,

    description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      type: "article",
      url,
      siteName: "MovieHmm",
      title: `${r.title} Review — MovieHmm`,
      description,
      images: [
        {
          url: image,
          alt: `${r.title} review — MovieHmm`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${r.title} Review — MovieHmm`,
      description,
      images: [image],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function ReviewPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const r = getReview(slug);

  if (!r) notFound();

  const pageUrl = `${SITE}/reviews/${r.slug}`;

  const imageUrl = r.poster.startsWith("http")
    ? r.poster
    : `${SITE}${r.poster}`;

  const reviewText = r.review.join(" ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: r.title,
    image: imageUrl,
    dateCreated: String(r.year),
    genre: r.genre,
    inLanguage: r.language,

    review: {
      "@type": "Review",

      url: pageUrl,

      author: {
        "@type": "Organization",
        name: "MovieHmm",
        url: SITE,
      },

      publisher: {
        "@type": "Organization",
        name: "MovieHmm",
        url: SITE,
      },

      datePublished: r.publishedDate,

      reviewRating: {
        "@type": "Rating",
        ratingValue: r.score,
        bestRating: 10,
        worstRating: 1,
      },

      name: `${r.title} Review`,

      reviewBody: reviewText,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <main className="article shell">
        <Link className="back" href="/">
          ← MOVIE-HMM
        </Link>

        <div className="reviewHero">
          <div className="reviewPosterFrame">
            <img
              src={r.poster}
              alt={`${r.title} — MovieHmm Review`}
            />
          </div>

          <div>
            <div className="meta">
              {r.language} · {r.genre} · {r.runtime} · {r.year}
            </div>

            <h1>{r.title}</h1>

            <div className="articleScore">
              <strong>{r.score.toFixed(1)}</strong>
              <span>/10</span>
              <b>{r.verdict}</b>
            </div>

            <p className="lead">{r.dek}</p>
          </div>
        </div>

        {r.watched && (
          <div className="watchedBlock">
            <div className="watchedBadge">
              ✓ WATCHED & REVIEWED
            </div>

            <div className="watchedGrid">
              <div>
                <span>WHEN</span>
                <strong>
                  {r.watched.date} · {r.watched.time}
                </strong>
              </div>

              <div>
                <span>WHERE</span>
                <strong>
                  {r.watched.venue} · {r.watched.city}
                </strong>
              </div>

              <div>
                <span>SCREEN</span>
                <strong>
                  {[
                    r.watched.auditorium,
                    r.watched.seat && `Seat ${r.watched.seat}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </strong>
              </div>

              <div>
                <span>FORMAT</span>
                <strong>{r.watched.format}</strong>
              </div>
            </div>
          </div>
        )}

        <div className="rule" />

        <div className="reviewSectionHead">
          <span>THE TAKE</span>
          <small>SPOILER-CONSCIOUS</small>
        </div>

        {r.review.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        <div className="prosCons">
          <div>
            <span>WHAT WORKED</span>
            <p>{r.works}</p>
          </div>

          <div>
            <span>WHERE IT LOST ME</span>
            <p>{r.misses}</p>
          </div>
        </div>

        <div className="finalVerdict">
          <span>THE VERDICT</span>
          <strong>{r.verdict}</strong>
          <b>{r.score.toFixed(1)} / 10</b>
        </div>
      </main>
    </>
  );
}
