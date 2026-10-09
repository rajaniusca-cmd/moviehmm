"use client";

import { useState } from "react";
import Link from "next/link";
import catalog from "@/content/binge-file/catalog.json";

export default function BingeFilePage() {
  const [query,setQuery] = useState("");
  const [language,setLanguage] = useState("All");

  const languages = [
    "All","Telugu","Tamil","Hindi",
    "Malayalam","Kannada","English"
  ];

  const filtered = catalog.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) &&
    (language === "All" || item.language === language)
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

      <div className="mhBingeSearchGrid">
        {filtered.map(item=>(
          <Link
            href={`/binge-file/${item.slug}`}
            key={item.slug}
            className="mhBingeSearchCard"
          >
            <img src={item.poster} alt={item.title}/>
            <small>{item.language} · {item.category}</small>
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
