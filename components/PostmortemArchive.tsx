"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Postmortem } from "@/lib/postmortem";

export default function PostmortemArchive({
  movies,
}: {
  movies: Postmortem[];
}) {

  const [query, setQuery] = useState("");

  const results = useMemo(() => {

    const q = query.trim().toLowerCase();

    if (!q) return movies;

    return movies.filter((x) => {

      const searchable = [
        x.title,
        x.language,
        x.diagnosis,
        x.caption,
        x.worked,
        x.failed,
        x.directorLesson,
        x.writerLesson,
        x.producerLesson
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(q);

    });

  }, [movies, query]);


  return (
    <>

      <div className="pmSearchBar">

        <label className="pmSearchBox">

          <span>⌕</span>

          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the autopsy table..."
            aria-label="Search movie postmortems"
          />

        </label>


        <div className="pmSearchPrompt">

          <span>TRY</span>

          <button onClick={() => setQuery("screenplay")}>
            SCREENPLAY
          </button>

          <button onClick={() => setQuery("director")}>
            DIRECTOR
          </button>

          <button onClick={() => setQuery("music")}>
            MUSIC
          </button>

          <button onClick={() => setQuery("editing")}>
            EDITING
          </button>

        </div>


        <div className="pmSearchCount">

          <strong>{results.length}</strong>

          <span>
            {results.length === 1
              ? "CASE FOUND"
              : "CASES FOUND"}
          </span>

        </div>

      </div>


      {results.length > 0 ? (

        <div className="pmLandingGrid">

          {results.map((x, i) => (

            <Link
              href={`/postmortem/${x.slug}`}
              className="pmLandingCard"
              key={x.slug}
            >

              <div className="pmLandingPoster">

                <img
                  src={x.poster}
                  alt={`${x.title} postmortem`}
                />

                <span>
                  {String(i + 1).padStart(2, "0")}
                </span>

              </div>

              <small>
                {x.language} · AFTER RELEASE
              </small>

              <h2>{x.title}</h2>

              <div
                className={`pmLandingDiagnosis pm${x.status}`}
              >
                <span>{x.emoji}</span>
                <strong>{x.diagnosis}</strong>
              </div>

              <p>{x.caption}</p>

              <b>
                OPEN THE POSTMORTEM →
              </b>

            </Link>

          ))}

        </div>

      ) : (

        <div className="pmSearchEmpty">

          <span>🎬</span>

          <h3>No case on the table.</h3>

          <p>
            Try another movie, department or diagnosis.
          </p>

          <button onClick={() => setQuery("")}>
            CLEAR SEARCH
          </button>

        </div>

      )}

    </>
  );
}
