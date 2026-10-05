"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Movie = {
  slug: string;
  title: string;
  poster: string;
  language: string;
  year: number;
  dek: string;
};

export default function HomeSpotlight({
  movies,
}: {
  movies: Movie[];
}) {
  const spotlightMovies = movies.slice(0, 5);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (spotlightMovies.length < 2) return;

    const timer = window.setInterval(() => {
      setActive((n) => (n + 1) % spotlightMovies.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [spotlightMovies.length]);

  if (!spotlightMovies.length) return null;

  const movie = spotlightMovies[active];

  const previous = () =>
    setActive(
      (n) =>
        (n - 1 + spotlightMovies.length) %
        spotlightMovies.length
    );

  const next = () =>
    setActive(
      (n) => (n + 1) % spotlightMovies.length
    );

  return (
    <section className="mhFinalSpotlight shell">

      <div className="mhFinalSpotlightHead">
        <div>
          <i />
          <strong>THE Movie....🤔hmm SPOTLIGHT</strong>
        </div>

        <em>One review gets the big screen.</em>
      </div>

      <div className="mhFinalSpotlightStage">

        <div className="mhFinalSpotlightArt">
          <img
            key={movie.slug}
            src={`/spotlight/${movie.slug}.png`}
            alt={`${movie.title} spotlight`}
          />
        </div>

        <div className="mhFinalSpotlightTake">

          <small>
            {movie.language} · {movie.year}
          </small>

          <span>MY TAKE</span>

          <p>{movie.dek}</p>

          <Link href={`/reviews/${movie.slug}`}>
            READ THE REVIEW
            <b>→</b>
          </Link>

        </div>

        <button
          type="button"
          className="mhFinalSpotArrow mhFinalPrev"
          onClick={previous}
          aria-label="Previous review"
        >
          ‹
        </button>

        <button
          type="button"
          className="mhFinalSpotArrow mhFinalNext"
          onClick={next}
          aria-label="Next review"
        >
          ›
        </button>

      </div>

      <div className="mhFinalSpotControls">

        <strong>
          {String(active + 1).padStart(2, "0")}
          <span> / </span>
          {String(spotlightMovies.length).padStart(2, "0")}
        </strong>

        <div>
          {spotlightMovies.map((item, index) => (
            <button
              type="button"
              key={item.slug}
              className={index === active ? "active" : ""}
              onClick={() => setActive(index)}
              aria-label={`Show ${item.title}`}
            />
          ))}
        </div>

      </div>

    </section>
  );
}
