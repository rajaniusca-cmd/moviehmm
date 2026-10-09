import BingeFileHome from "@/components/BingeFileHome";
import Link from"next/link";import{getAllReviews}from"@/lib/reviews";import HomeSpotlight from"@/components/HomeSpotlight";
import {getAllCrystalBalls} from "@/lib/crystalBall";
import {getAllPostmortems} from "@/lib/postmortem";
const trendingReasons:Record<string,string>={"hanuman-ansh": "Faith touches the heart. The storytelling doesn't always reach the same height.", "baththa": "A powerful idea about childhood and fear, with moments that stay longer than the film.", "drishyam-the-conclusion": "Too much waiting for the final move. The climax makes the patience worthwhile.", "dorothy": "Brave storytelling and strong performances. Some emotional turns needed more breathing room.", "dont-trouble-the-trouble": "A charming little fantasy that works best when it stops trying to explain itself."};
const leads=["hanuman-ansh","baththa","drishyam-the-conclusion","dorothy","dont-trouble-the-trouble"];
const spotlightLeads=["hanuman-ansh","baththa","drishyam-the-conclusion","dorothy","dont-trouble-the-trouble"];
const horoscopeLeads=["comrade-kalyan","jailer-2","ranabaali","418","aadarsha-kutumbam"];
const newReviewLeads=["mother-promise","chakora","hanuman-ansh","dorothy","baththa","sigma","anakapalli","thella-kaagitham","drishyam-the-conclusion"];
export default function Home(){const allPostmortems=getAllPostmortems();const postmortems=["the-paradise","dont-trouble-the-trouble","thella-kaagitham","baththa","sigma"].map(s=>allPostmortems.find(x=>x.slug===s)).filter((x):x is NonNullable<typeof x>=>!!x);const allCrystalBalls=getAllCrystalBalls();const crystalBalls=horoscopeLeads.map(s=>allCrystalBalls.find(x=>x.slug===s)).filter((x):x is NonNullable<typeof x>=>!!x);const reviews=getAllReviews(),f=leads.map(s=>reviews.find(r=>r.slug===s)).filter((r):r is NonNullable<typeof r>=>!!r),spotlight=spotlightLeads.map(s=>reviews.find(r=>r.slug===s)).filter((r):r is NonNullable<typeof r>=>!!r),newReviews=newReviewLeads.map(s=>reviews.find(r=>r.slug===s)).filter((r):r is NonNullable<typeof r>=>!!r),shelf=["chakora","anakapalli","sigma","thella-kaagitham","the-paradise","toxic-a-fairy-tale-for-grown-ups"].map(s=>reviews.find(r=>r.slug===s)).filter((r):r is NonNullable<typeof r>=>!!r);return <><header className="dhHeader shell"><Link href="/" className="dhBrand">Movie....🤔<em>hmm</em><small>WE WATCH. WE THINK. WE WRITE.</small></Link><nav><a href="#spotlight">Spotlight</a><a href="#trending">Trending</a><a href="#latest">New Reviews</a><a href="/binge-file">The Binge File</a><a href="/horoscope">Horoscope 🔮</a><a href="/postmortem">Postmortem 🎬</a><a href="#shelf">The Shelf</a></nav></header><main><section className="dhMast shell">
  <div className="mhEditionBar">

    <div className="mhEditionLead">
      <span>THE INDEPENDENT TAKE</span>
      <strong>No hype. No hate.</strong>
      <em>Just the movie.</em>
    </div>

    <div className="mhEditionRule">
      <strong>WATCH.</strong>
      <strong>THINK.</strong>
      <strong>TALK.</strong>
    </div>

    <div className="mhEditionQuote">
      <b>“</b>
      <p>
        Same movie. A different take.
        <em>That’s the point.</em>
      </p>
    </div>

  </div>

</section>


<div id="spotlight"><HomeSpotlight movies={spotlight}/></div><section id="trending" className="dhSection shell"><div className="dhHead"><strong>TRENDING REVIEWS</strong><small>START HERE</small></div><div className="dhPosters">{f.map((m,i)=><Link href={`/reviews/${m.slug}`} key={m.slug}><div><img src={m.poster} alt={m.title}/><span>{String(i+1).padStart(2,"0")}</span></div>
<aside className="mhTrendingRating">
  <strong>{m.score.toFixed(1)} / 10</strong>
  <span className="mhTrendingReason">
    {trendingReasons[m.slug] ?? m.verdict}
  </span>
</aside>
<small>{m.language} · {m.year}</small>
<h3>{m.title}</h3>
<p>{m.dek}</p>
<b>THE VERDICT IS IN →</b>
</Link>)}</div></section>


<section id="crystal-ball" className="cbHome shell">

  <div className="cbHead">
    <div>
      <span>🔮</span>
      <strong>UPCOMING MOVIE HOROSCOPE</strong>
    </div>

    <small>
      Reading the signs before the first show.
    </small>
  </div>

  <Link href="/horoscope" className="horoscopeExplore horoscopePortal">

      <div className="horoscopePortalMark">
        <span>🔮</span>
        <small>BEFORE THE FIRST SHOW</small>
      </div>

      <div className="horoscopePortalCopy">
        <strong>ENTER THE FORECAST</strong>

        <p>
          I read nine movie signs and call the fate
          before the audience gets its turn.
        </p>
      </div>

      <div className="horoscopePortalAction">
        <small>ALL HOROSCOPES</small>
        <b>→</b>
      </div>

    </Link>

  <div className="cbRail">

    {crystalBalls.slice(0,5).map((x) => (

      <Link
        href={`/crystal-ball/${x.slug}`}
        className="cbCard"
        key={x.slug}
      >

        <img
          src={x.poster}
          alt={`${x.title} Movie....🤔hmm prediction`}
        />

        <div className="cbPosterForecast">
          <strong>{x.hitProbability}%</strong>
          <span>{x.predictionTag ?? 'THE EARLY CALL'}</span>
        </div>

        <div>

          <small>
            {x.language} · {x.releaseDate}
          </small>

          <h3>{x.title}</h3>

          <b>
            {x.emoji} {x.call}
          </b>

          <p>{x.hook}</p>

          

          <span>
            READ THE HOROSCOPE →
          </span>

        </div>

      </Link>

    ))}

  </div>

  <p className="cbDisclaimer">
    No ratings here. I haven't watched them yet —
    I'm judging the ingredients, not the meal. 🔮
  </p>

</section>

<BingeFileHome />

<section id="postmortem" className="pmHome dhSection shell">

  <div className="pmHomeHead">

    <div>
      <span>🎬</span>

      <div>
        <small>AFTER THE CREDITS</small>
        <strong>THE Movie....🤔hmm POSTMORTEM</strong>
      </div>
    </div>

    <p>
      The review tells you whether it worked.
      <b> Now let's find out why.</b>
    </p>

  </div>


  <div className="pmHomeGrid">

    {postmortems.map((x,i)=>(

      <Link
        href={`/postmortem/${x.slug}`}
        className="pmHomeCard"
        key={x.slug}
      >

        <div className="pmHomePoster">

          <img
            src={x.poster}
            alt={`${x.title} postmortem`}
          />

          <span>
            {String(i+1).padStart(2,"0")}
          </span>

        </div>

        <div className="pmHomeCopy">

          <small>
            {x.language} · AFTER RELEASE
          </small>

          <h3>{x.title}</h3>

          <div className={`pmHomeDiagnosis pm${x.status}`}>
            <span>{x.emoji}</span>
            <strong>{x.diagnosis}</strong>
          </div>

          <p>{x.caption}</p>

          <b>OPEN THE POSTMORTEM →</b>

        </div>

      </Link>

    ))}

  </div>


  <Link
    href="/postmortem"
    className="pmHomePortal"
  >

    <div>
      <small>THE CREDITS ROLLED.</small>
      <strong>THE LEARNING SHOULDN'T.</strong>
    </div>

    <p>
      Hero. Director. Writing. Music. Editing.
      Audience. Producer. What worked, what failed,
      and what the next film should learn.
    </p>

    <span>ENTER THE AUTOPSY →</span>

  </Link>

</section>

<section id="latest" className="dhSection shell"><div className="dhHead"><strong>NEW REVIEWS</strong><small>FRESH FROM Movie....🤔hmm</small></div><div className="dhLatest">{newReviews.map(m=><Link href={`/reviews/${m.slug}`} key={m.slug}><img src={m.poster} alt={m.title}/><div><small>NEW TAKE · {m.language} · {m.year}</small><h3>{m.title}</h3><p>{m.dek}</p><b>OPEN REVIEW →</b></div></Link>)}</div></section>


<section id="shelf" className="dhSection shell">
  <div className="dhHead">
    <strong>FROM THE REVIEW SHELF</strong>
    <small>A FEW MORE BEFORE YOU GO</small>
  </div>

  <div className="dhShelf">
    {shelf.slice(0,4).map(m=>
      <Link href={`/reviews/${m.slug}`} key={m.slug}>
        <img src={m.poster} alt={m.title}/>
        <div>
          <small>{m.language} · {m.year}</small>
          <h3>{m.title}</h3>
          <p>{m.dek}</p>
          <b>TAKE IT OFF THE SHELF →</b>
        </div>
      </Link>
    )}
  </div>

  <div className="fullShelfCallout">
    <div>
      <small>THE ARCHIVE</small>
      <h2>Still looking for something to watch?</h2>
      <p>
        Every movie I've reviewed lives on the full shelf —
        the good, the bad, and the ones that made me go hmm. 🤔
      </p>
    </div>

    <Link href="/reviews">
      VIEW THE FULL SHELF
      <span>→</span>
    </Link>
  </div>
</section></main></>}