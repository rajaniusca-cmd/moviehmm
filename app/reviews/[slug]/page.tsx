import {getReview,getAllReviews} from "@/lib/reviews";import {notFound} from "next/navigation";import Link from "next/link";import MovieReactions from "@/components/MovieReactions";import ReviewReactions from "@/components/ReviewReactions";
function scoreClass(score: number) {
  if (score >= 9) return "score9";
  if (score >= 8) return "score8";
  if (score >= 7) return "score7";
  if (score >= 6) return "score6";
  if (score >= 5) return "score5";
  return "scoreLow";
}

export function generateStaticParams(){return getAllReviews().map(r=>({slug:r.slug}))}
export default async function ReviewPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const r=getReview(slug);if(!r)notFound();return <main className="article shell"><Link className="back" href="/">← MOVIE-HMM</Link><div className="reviewHero"><div className="reviewPosterFrame"><img src={r.poster} alt={`${r.title} — Movie... hmm Review`}/></div><div><div className="meta">{r.language} · {r.genre} · {r.runtime} · {r.year}</div><h1>{r.title}</h1><div className={`articleScore ${scoreClass(r.score)}`}><strong>{r.score.toFixed(1)}</strong><span>/10</span><b>{r.verdict}</b></div><p className="lead">{r.dek}</p></div></div>{r.watched&&<div className="watchedBlock"><div className="watchedBadge">✓ WATCHED & REVIEWED</div><div className="watchedGrid"><div><span>WHEN</span><strong>{r.watched.date} · {r.watched.time}</strong></div><div><span>WHERE</span><strong>{r.watched.venue} · {r.watched.city}</strong></div><div><span>SCREEN</span><strong>{[r.watched.auditorium,r.watched.seat&&`Seat ${r.watched.seat}`].filter(Boolean).join(" · ")}</strong></div><div><span>FORMAT</span><strong>{r.watched.format}</strong></div></div></div>}<div className="rule"/><div className="reviewSectionHead"><span>THE TAKE</span><small>SPOILER-CONSCIOUS</small></div>{r.review.map((p,i)=><p key={i}>{p}</p>)}<div className="prosCons"><div><span>WHAT WORKED</span><p>{r.works}</p></div><div><span>WHERE IT LOST ME</span><p>{r.misses}</p></div></div><div className={`finalVerdict ${scoreClass(r.score)}`}><span>THE VERDICT</span><strong>{r.verdict}</strong><b>{r.score.toFixed(1)} / 10</b></div><div className="humanNote">
  <span>THE HUMAN BIT</span>
  <p>
    <strong>AI-generated review? Nope.</strong> I watch. I think. I judge. I rate.
    Technology just makes sure my English survives the journey from my head to
    your screen. The <em>“hmm”</em> is completely mine. 🤔
  </p>
</div><MovieReactions movieSlug={r.slug}/><ReviewReactions movieSlug={r.slug}/>

</main>}