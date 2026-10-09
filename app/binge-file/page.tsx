"use client";
import OttPlatform from "@/components/OttPlatform";

import { useState } from "react";
import Link from "next/link";
import catalog from "@/content/binge-file/catalog.json";

export default function BingeFilePage() {
  const [query,setQuery] = useState("");
  const [language,setLanguage] = useState("All");
  const [platform,setPlatform] = useState("All");

  const languages = [
    "All","Telugu","Tamil","Hindi",
    "Malayalam","Kannada","English"
  ];

  const platforms = [
    "All",
    ...Array.from(new Set(
      catalog.flatMap(item =>
        (item.platform ?? "")
          .split("·")
          .map(x => x.trim())
          .filter(Boolean)
      )
    )).sort()
  ];

  const filtered = catalog.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) &&
    (language === "All" || item.language === language) &&
    (
      platform === "All" ||
      (item.platform ?? "")
        .split("·")
        .map(x => x.trim())
        .includes(platform)
    )
  );

  return (
    <main className="shell mhBingeArchive">

      <Link href="/" className="mhBingeBack">
        ← MOVIE....🤔HMM HOME
      </Link>

      <header className="mhBingeArchiveHead">
        <small>THE MOVIE....🤔HMM BINGE FILE</small>

        <h1>
          I call it <em>worth your time.</em>
        </h1>

        <p>
          Web series. Seasons. Short films.
          Every minute should earn its place.
        </p>
      </header>

      <div className="mhBingeSearchRow">

        <div className="mhBingeSearchLine">
          <span>⌕</span>
          <input
            value={query}
            onChange={e=>setQuery(e.target.value)}
            placeholder="Search the Binge File..."
          />
        </div>

        <div className="mhBingePills">
          {languages.map(x=>(
            <button
              key={x}
              type="button"
              className={language===x?"active":""}
              onClick={()=>setLanguage(x)}
            >
              {x}
            </button>
          ))}
        </div>

        <div className="mhBingeCount">
          <strong>{filtered.length}</strong>
          <span>FILES FOUND</span>
        </div>

      </div>

      <section className="bfPlatformBrowse">
        <div className="bfPlatformBrowseHead">
          <div>
            <small>STREAMING DIRECTORY</small>
            <h2>📺 Browse by Platform</h2>
          </div>
          <span>FIND YOUR NEXT WATCH</span>
        </div>

        <div className="bfPlatformPills">
          {platforms.map(name => {
            const count = catalog.filter(item =>
              name === "All" ||
              (item.platform ?? "")
                .split("·")
                .map(x => x.trim())
                .includes(name)
            ).length;

            return (
              <button
                key={name}
                type="button"
                className={platform === name ? "active" : ""}
                onClick={() => setPlatform(name)}
              >
                <span>{name === "All" ? "📺 All OTT" : name}</span>
                <b>{count}</b>
              </button>
            );
          })}
        </div>
      </section>

      <div className="mhBingeSearchGrid">
        {filtered.map(item=>(
          <Link
            href={`/binge-file/${item.slug}`}
            key={item.slug}
            className="mhBingeSearchCard"
          >
            <img src={item.poster} alt={item.title}/>
            <small>{item.language} · {item.category}</small>
            <small className="bfCardPlatform">
              <OttPlatform platform={item.platform ?? ""} />
            </small>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <strong>
              {item.score === null?"UNRATED":`${item.score}/10`}
              {" · "}{item.verdict}
            </strong>
          </Link>
        ))}
      </div>

      {filtered.length===0&&<p>No matching reviews found.</p>}

    </main>
  );
}
