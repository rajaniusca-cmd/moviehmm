"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Review = {
  slug: string;
  title: string;
  poster: string;
  language: string;
  year: number;
  dek: string;
};

export default function ReviewShelf({
  reviews,
}: {
  reviews: Review[];
}) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("ALL");

  const languages = [
    "ALL",
    "Malayalam",
    "Hindi",
    "Telugu",
    "Tamil",
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return reviews.filter((r) => {
      const matchesLanguage =
        language === "ALL" || r.language === language;

      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.language.toLowerCase().includes(q) ||
        String(r.year).includes(q) ||
        r.dek.toLowerCase().includes(q);

      return matchesLanguage && matchesSearch;
    });
  }, [reviews, query, language]);

  return (
    <>
      <div className="shelfSearch">

        <div className="shelfSearchBox">
          <span>⌕</span>

          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the shelf..."
            aria-label="Search reviews"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="shelfLanguages">
          {languages.map((item) => (
            <button
              type="button"
              key={item}
              className={language === item ? "active" : ""}
              onClick={() => setLanguage(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="shelfResultCount">
          <strong>{filtered.length}</strong>
          <span>
            {filtered.length === 1 ? " TAKE FOUND" : " TAKES FOUND"}
          </span>
        </div>

      </div>

      {filtered.length > 0 ? (

        <section className="archiveGrid">

          {filtered.map((m, i) => (
            <Link
              href={`/reviews/${m.slug}`}
              className="archiveCard"
              key={m.slug}
            >

              <div className="archivePoster">
                <img src={m.poster} alt={m.title} />

                <span>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <small>
                {m.language} · {m.year}
              </small>

              <h2>{m.title}</h2>

              <p>{m.dek}</p>

              <b>READ MY TAKE →</b>

            </Link>
          ))}

        </section>

      ) : (

        <div className="emptyShelf">
          <span>🤔</span>

          <h2>Hmm... nothing on this shelf.</h2>

          <p>
            Try another movie title or language.
          </p>

          <button
            type="button"
            onClick={() => {
              setQuery("");
              setLanguage("ALL");
            }}
          >
            SHOW EVERYTHING →
          </button>
        </div>

      )}
    </>
  );
}
