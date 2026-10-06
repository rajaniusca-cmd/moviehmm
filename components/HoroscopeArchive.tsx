"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CrystalBall } from "@/lib/crystalBall";

const filters = [
  "ALL",
  "Telugu",
  "Tamil",
  "Hindi",
  "Malayalam",
  "Multilingual",
];

export default function HoroscopeArchive({
  movies,
}: {
  movies: CrystalBall[];
}) {

  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("ALL");

  const results = useMemo(() => {

    const q = query.trim().toLowerCase();

    return movies.filter((x) => {

      const languageMatch =
        language === "ALL" ||
        x.language.toLowerCase() === language.toLowerCase();

      const text = [
        x.title,
        x.language,
        x.call,
        x.forecast,
        x.forecastLine,
      ]
        .join(" ")
        .toLowerCase();

      return languageMatch && (!q || text.includes(q));

    });

  }, [movies, query, language]);


  return (
    <>

      <div className="horoscopeSearch">

        <label className="horoscopeSearchBox">

          <span>⌕</span>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the crystal ball..."
            aria-label="Search movie horoscopes"
          />

        </label>

        <div className="horoscopeFilters">

          {filters.map((x) => (

            <button
              key={x}
              type="button"
              className={language === x ? "active" : ""}
              onClick={() => setLanguage(x)}
            >
              {x}
            </button>

          ))}

        </div>

        <div className="horoscopeFound">

          <strong>{results.length}</strong>

          <span>
            {results.length === 1
              ? "FATE FOUND"
              : "FATES FOUND"}
          </span>

        </div>

      </div>


      {results.length ? (

        <div className="horoscopeLandingGrid horoscopeArchiveGrid">

          {results.map((x, i) => (

            <Link
              href={`/crystal-ball/${x.slug}`}
              className="horoscopeLandingCard horoscopeArchiveCard"
              key={x.slug}
            >

              <div className="horoscopeLandingPoster horoscopeArchivePoster">

                <img
                  src={x.poster}
                  alt={`${x.title} movie horoscope`}
                />

                <span>
                  {String(i + 1).padStart(2, "0")}
                </span>

              </div>


              <div className="horoscopeLandingMeta">

                <small>
                  {x.language} · {x.releaseDate}
                </small>

                <h2>{x.title}</h2>


                <div className="landingSigns">

                  <span>THE SIGNS</span>

                  <b>
                    {x.emoji} {x.call}
                  </b>

                </div>


                <div className="landingForecast">

                  <span>MY FATE FORECAST</span>

                  <strong>
                    {x.forecastEmoji} {x.forecast}
                  </strong>

                  <small>
                    {x.confidence}% MY CONFIDENCE
                  </small>

                </div>


                <p>{x.forecastLine}</p>

                <b className="landingRead">
                  READ THE 9-PLANET HOROSCOPE →
                </b>

              </div>

            </Link>

          ))}

        </div>

      ) : (

        <div className="horoscopeEmpty">

          <span>🔮</span>

          <h3>Nothing in the crystal ball.</h3>

          <p>
            Try another movie, language or forecast.
          </p>

        </div>

      )}

    </>
  );
}
