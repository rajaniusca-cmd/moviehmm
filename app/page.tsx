import Link from "next/link";
import { getAllReviews } from "@/lib/reviews";

function scoreClass(score: number) {
  if (score >= 9) return "score score9";
  if (score >= 8) return "score score8";
  if (score >= 7) return "score score7";
  if (score >= 6) return "score score6";
  if (score >= 5) return "score score5";
  return "score scoreLow";
}

const featuredSlugs = [
  "drishyam-the-conclusion",
  "dont-trouble-the-trouble",
  "thella-kaagitham",
  "bethlehem-kudumba-unit",
];

export default function Home() {
  const reviews = getAllReviews();

  const featuredReviews = featuredSlugs
    .map((slug) => reviews.find((r) => r.slug === slug))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const shelfReviews = reviews.filter(
    (r) => !featuredSlugs.includes(r.slug)
  );

  const index = reviews;

  return (
    <>
      <header className="header shell">
        <Link className="topMovieLogo" href="/" aria-label="Movie hmm">
          <span>Movie</span>
          <b>....</b>
          <i>🤔</i>
          <em>hmm</em>
          <small>WE WATCH. WE THINK. WE WRITE.</small>
        </Link>

        <nav className="nav">
          <Link href="/#reviews">REVIEWS</Link>
          <Link href="/#index">INDEX</Link>
          <Link href="/editorial-policy">STANDARD</Link>
        </nav>
      </header>

      <main>
        <section className="finalHero shell">
          <div className="finalStrip">
            <span>INDEPENDENT MOVIE REVIEWS</span>
            <span>NO HYPE. NO HATE. JUST THE MOVIE.</span>
          </div>

          <div className="finalHeroBody">
            <div className="finalHeroCopy">
              <h1>
                No hype. No hate.
                <em>Just the movie.</em>
              </h1>

              <p className="finalDek">
                HONEST REVIEWS FOR PEOPLE WHO ACTUALLY WATCH.
              </p>

              <div className="finalQuote">
                <b>“</b>
                <p>
                  Same movie.
                  <br />
                  A different take.
                  <br />
                  <em>That’s the point.</em>
                </p>
                <span />
                <small>MOVIE....🤔HMM</small>
              </div>
            </div>
          </div>
        </section>

        <section className="featureWrap shell">
          <div className="sectionLabel">FEATURED REVIEWS</div>

          <div className="dualFeature">
            {featuredReviews.map((movie) => (
              <Link
                href={`/reviews/${movie.slug}`}
                className="dualFeatureCard"
                key={movie.slug}
              >
                <div className="dualFeaturePosterWrap">
                  <img
                    src={movie.poster}
                    alt={`${movie.title} review poster`}
                    className="dualFeaturePoster"
                  />
                </div>

                <div className="dualFeatureCopy">
                  <div className="meta">
                    {movie.language} · {movie.year}
                  </div>

                  <h2>{movie.title}</h2>

                  <p>{movie.dek}</p>

                  <div className="dualFeatureBottom">
                    <strong>{movie.verdict}</strong>
                    <span className={scoreClass(movie.score)}>
                      {movie.score.toFixed(1)}
                    </span>
                  </div>

                  <span className="readLink">
                    READ THE REVIEW →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="reviews" className="contentGrid shell">
          <div className="reviewsMain">
            <div className="sectionHead">
              <div className="sectionLabel">
                FROM THE REVIEW SHELF
              </div>
              <span>{reviews.length} reviews</span>
            </div>

            <div className="cardGrid">
              {shelfReviews.map((r) => (
                <Link
                  className="reviewCard"
                  href={`/reviews/${r.slug}`}
                  key={r.slug}
                >
                  <div className="reviewPosterWrap">
                    <img
                      src={r.poster}
                      alt={`${r.title} review poster`}
                      className="reviewPosterImage"
                    />

                    <div className={`cornerScore ${scoreClass(r.score)}`}>
                      {r.score.toFixed(1)}
                    </div>
                  </div>

                  <div className="cardTop">
                    <h3>{r.title}</h3>

                    <div className="shelfScore">
                      <span>MOVIE...</span>
                      <em>hmm</em>
                      <strong>{r.score.toFixed(1)}</strong>
                    </div>
                  </div>

                  <div className="meta">
                    {r.language} · {r.year}
                  </div>

                  <p>{r.dek}</p>

                  <div className="miniVerdict">
                    {r.verdict}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside id="index" className="reviewIndex">
            <div className="sticky">
              <p className="sectionLabel">ALL REVIEWS</p>

              <h2>
                Every film.
                <br />
                One honest take.
              </h2>

              <div className="indexList">
                {index.map((r) => (
                  <Link
                    href={`/reviews/${r.slug}`}
                    key={r.slug}
                  >
                    <span>{r.title}</span>
                    <b className={`indexScore ${scoreClass(r.score)}`}>
                      {r.score.toFixed(1)}
                    </b>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="standard shell">
          <p className="eyebrow">THE MOVIE-HMM STANDARD</p>

          <h2>An 8 should mean something.</h2>

          <p>
            We do not inflate scores for stars, fandoms or
            opening-weekend excitement. We do not underrate films
            to look clever. The review explains the score, and the
            score has to be earned.
          </p>

          <Link href="/about">HOW WE RATE →</Link>
        </section>
      </main>

      <footer className="footer shell">
        <div>
          <div className="footerMovieLogo">
            <span>Movie</span>
            <b>....</b>
            <i>🤔</i>
            <em>hmm</em>
          </div>

          <div className="legalNav">
            <Link href="/editorial-policy">Editorial Policy</Link>
            <Link href="/disclaimer">Disclaimer</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/copyright">Copyright & DMCA</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        <p>No hype. No hate. Just the movie.</p>
        <small>© 2026 Movie-Hmm. All rights reserved.</small>
      </footer>
    </>
  );
}
