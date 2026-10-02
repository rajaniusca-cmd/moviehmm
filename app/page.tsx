import Link from "next/link";import {getAllReviews,getFeaturedReview,mark} from "@/lib/reviews";
function Stamp({score}:{score:number}){return <div className="signatureStamp"><span>MOVIE...</span><em>hmm</em><strong>{score.toFixed(1)}</strong></div>}
export default function Home(){const reviews=getAllReviews();const featured=getFeaturedReview();const rest=reviews.filter(r=>r.slug!==featured.slug);const index=[...reviews].sort((a,b)=>a.title.localeCompare(b.title));return <><header className="siteHeader shell"><Link className="brand" href="/">MOVIE<span>—HMM</span></Link><nav><a href="#reviews">Reviews</a><a href="#index">Index</a><Link href="/about">Our Standard</Link></nav></header><main>
<section className="editorialHero shell">
  <div className="editorialKicker">
    <span>INDEPENDENT MOVIE REVIEWS</span>
    <span>NO HYPE. NO HATE. JUST THE MOVIE.</span>
  </div>
  <div className="editorialHeroGrid">
    <div className="editorialStatement">
      <h1>No hype. No hate.<em>Just the movie.</em></h1>
      <p>HONEST REVIEWS FOR PEOPLE WHO ACTUALLY WATCH.</p>
    </div>
    <div className="editorialThought">
      <div className="quoteMark">“</div>
      <p>Same movie.<br/>A different take.<br/><em>That’s the point.</em></p>
      <span>MOVIE... HMM</span>
    </div>
    <div className="reelMark" aria-hidden="true">
      <div className="reelHole h1"></div><div className="reelHole h2"></div>
      <div className="reelHole h3"></div><div className="reelHole h4"></div>
      <div className="reelHub"></div>
    </div>
  </div>
</section>
<section className="featureWrap shell"><div className="sectionLabel">FEATURED REVIEW</div><div className="featureGrid"><Link href={`/reviews/${featured.slug}`} className="featuredPosterLink">
  <img src={featured.poster} alt={`${featured.title} — Movie... hmm review`} className="featuredPosterImage"/>
</Link><div className="featureCopy"><div className="meta">{featured.language} · {featured.genre} · {featured.year}</div><h2>{featured.title}</h2><div className="featureScore"><Stamp score={featured.score}/><div><div className="verdict">{featured.verdict}</div><p>{featured.dek}</p></div></div><Link className="readLink" href={`/reviews/${featured.slug}`}>READ THE REVIEW →</Link></div><aside className="scoreKey"><span className="eyebrow">THE REACTION</span><h3>That feeling after<br/>the credits.</h3>
<div><b>9+</b><i>🤩</i><span>Hmm... wow.</span></div>
<div><b>8+</b><i>😍</i><span>Hmm... yes.</span></div>
<div><b>7+</b><i>🙂</i><span>Hmm... good.</span></div>
<div><b>6+</b><i>🤔</i><span>Hmm...</span></div>
<div><b>&lt;6</b><i>😕</i><span>Hmm... no.</span></div>
<div className="reactionSignature"><i>🤔</i><strong>MOVIE... <em>hmm</em></strong><small>WE WATCH. WE THINK. WE WRITE.<br/>EVERY SCORE HAS TO BE EARNED.</small></div>
</aside></div></section>
<section id="reviews" className="contentGrid shell"><div className="reviewsMain"><div className="sectionHead"><div className="sectionLabel">FROM THE REVIEW SHELF</div><span>{reviews.length} reviews</span></div><div className="cardGrid">{rest.map((r,i)=><Link className="reviewCard" href={`/reviews/${r.slug}`} key={r.slug}><div className="reviewPosterWrap"><img src={r.poster} alt={`${r.title} review poster`} className="reviewPosterImage"/><div className="cornerScore">{r.score.toFixed(1)}</div></div><div className="cardTop"><h3>{r.title}</h3><div className="shelfScore"><span>MOVIE...</span><em>hmm</em><strong>{r.score.toFixed(1)}</strong></div></div><div className="meta">{r.language} · {r.year}</div><p>{r.dek}</p><div className="miniVerdict">{r.verdict}</div></Link>)}</div></div>
<aside id="index" className="reviewIndex"><div className="sticky"><p className="sectionLabel">ALL REVIEWS</p><h2>Every film.<br/>One honest take.</h2><div className="indexList">{index.map(r=><Link href={`/reviews/${r.slug}`} key={r.slug}><span>{r.title}</span><b>{r.score.toFixed(1)}</b></Link>)}</div></div></aside></section>
<section className="standard shell"><p className="eyebrow">THE MOVIE-HMM STANDARD</p><h2>An 8 should mean something.</h2><p>We do not inflate scores for stars, fandoms or opening-weekend excitement. We do not underrate films to look clever. The review explains the score, and the score has to be earned.</p><Link href="/about">HOW WE RATE →</Link></section></main><footer className="footer shell"><div><div className="brand brandEditorial"><span className="brandMovie">Movie</span><span className="brandDots">...</span><em>hmm</em><sup className="tm">™</sup></div><div className="legalNav"><Link href="/editorial-policy">Editorial Policy</Link><Link href="/disclaimer">Disclaimer</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/copyright">Copyright & DMCA</Link><Link href="/contact">Contact</Link></div></div><p>No hype. No hate. Just the movie.</p><small>© 2026 Movie-Hmm. All rights reserved.</small></footer></>}
