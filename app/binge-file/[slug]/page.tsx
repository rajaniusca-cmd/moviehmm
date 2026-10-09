import OttPlatform from "@/components/OttPlatform";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";

type Episode = {
  number: number;
  title: string;
  take: string;
};

type Review = {
  slug: string;
  title: string;
  language: string;
  category: string;
  poster: string;
  score: number | null;
  verdict: string;
  platform?: string;
  hook?: string;
  editorialHeadline?: string;
  review: string[];
  works: string;
  misses: string;
  episodes?: Episode[];
  note?: string;
};

const DIR = path.join(process.cwd(), "content/binge-file");

function loadReview(slug: string): Review | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;

  const file = path.join(DIR, `${slug}.json`);

  if (!fs.existsSync(file)) return null;

  const data = JSON.parse(fs.readFileSync(file, "utf8"));

  if (!Array.isArray(data.review) || data.slug !== slug) {
    return null;
  }

  return data as Review;
}

export function generateStaticParams() {
  return fs.readdirSync(DIR)
    .filter(f => f.endsWith(".json") && f !== "catalog.json")
    .map(f => ({ slug: f.replace(/\.json$/, "") }));
}

export default async function Page({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const r = loadReview(slug);

  if (!r) notFound();

  return (
    <main className="shell bfReviewPage">

      <header className="bfReviewMast">
        <Link href="/" className="bfReviewBrand">
          Movie....🤔<em>hmm</em>
        </Link>
        <span>THE INDEPENDENT TAKE</span>
      </header>

      <nav className="bfReviewNav">
        <Link href="/binge-file">← THE BINGE FILE</Link>
        <span>{r.language} / {r.category}</span>
      </nav>

      <div className="bfReviewHeading">
        <small>THE BINGE FILE · THE FULL TAKE</small>
        <h1>{r.title}</h1>
        {r.editorialHeadline && (
          <h2 className="bfEditorialHeadline">
            {r.editorialHeadline}
          </h2>
        )}
        <p>{r.hook}</p>
      </div>

      <div className="bfReviewHero">
        <div className="bfReviewPoster">
          <img src={r.poster} alt={`${r.title} official artwork`} />
        </div>

        <div className="bfReviewVerdict">
          <small>THE MOVIE....🤔HMM VERDICT</small>
          <strong>
            {r.score === null ? "UNRATED" : `${r.score} / 10`}
          </strong>
          <h2>{r.verdict}</h2>
          {r.platform && (
            <div className="bfPlatform">
              <small>NOW STREAMING ON</small>
              <OttPlatform platform={r.platform ?? ""} />
            </div>
          )}
          <p>
            {r.review[0]}
          </p>
        </div>
      </div>

      <section className="bfReviewBody">
        <div className="bfReviewSectionLabel">
          <span>01</span>
          <h2>THE FULL TAKE</h2>
        </div>

        {r.review.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </section>

      <div className="bfReviewProsCons">
        <section>
          <small>02 / THE GOOD</small>
          <h2>WHAT WORKED</h2>
          <p>{r.works}</p>
        </section>

        <section>
          <small>03 / THE RESERVATIONS</small>
          <h2>WHAT DIDN'T</h2>
          <p>{r.misses}</p>
        </section>
      </div>

      {(r.episodes?.length ?? 0) > 0 && (
        <section className="bfReviewEpisodes">
          <div className="bfReviewSectionLabel">
            <span>04</span>
            <h2>EPISODE BY EPISODE</h2>
          </div>

          {r.episodes!.map(ep => (
            <article key={ep.number}>
              <span>{String(ep.number).padStart(2, "0")}</span>
              <div>
                <h3>{ep.title}</h3>
                <p>{ep.take}</p>
              </div>
            </article>
          ))}
        </section>
      )}

      {r.note && <p className="bfReviewNote">{r.note}</p>}

      <footer className="bfReviewFooter">
        <strong>Movie....🤔hmm</strong>
        <Link href="/binge-file">MORE BINGE FILE REVIEWS →</Link>
      </footer>
    </main>
  );
}
