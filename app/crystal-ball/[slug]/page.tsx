import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllCrystalBalls,
  getCrystalBall,
} from "@/lib/crystalBall";

export function generateStaticParams() {
  return getAllCrystalBalls().map((x) => ({
    slug: x.slug,
  }));
}

export default async function HoroscopePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const x = getCrystalBall(slug);

  if (!x) notFound();

  const chart = [
    ["STAR POWER", x.starPower],
    ["DIRECTOR FORM", x.directorForm],
    ["WRITING / SCREENPLAY", x.writingScreenplay],
    ["MUSIC FACTOR", x.musicFactor],
    ["CAST CHEMISTRY", x.castChemistry],
    ["GENRE / WORLD", x.genreWorld],
    ["BUZZ / EXPECTATION", x.buzz],
    ["RELEASE CLIMATE", x.releaseClimate],
    ["X-FACTOR", x.xFactor],
  ];

  return (
    <main className="horoscopePage shell">

      <Link href="/" className="back">
        ← Movie....🤔hmm
      </Link>

      <header className="horoscopeHero">

        <div className="horoscopePoster">
          <img src={x.poster} alt={x.title} />
        </div>

        <div className="horoscopeHeroCopy">

          <span className="horoscopeKicker">
            🔮 UPCOMING MOVIE HOROSCOPE
          </span>

          <small>
            {x.language} · {x.releaseDate}
          </small>

          <h1>{x.title}</h1>

          <p className="horoscopeHook">
            {x.hook}
          </p>

          <div className="horoscopeSigns">
            <small>THE SIGNS</small>

            <strong>
              {x.emoji} {x.call}
            </strong>
          </div>

        </div>

      </header>


      <section className="birthChart">

        <header>
          <span>THE BIRTH CHART</span>

          <h2>
            Nine planets. One movie fate.
          </h2>

          <p>
            Not astrology in the literal sense.
            Nine signals I look at before the first show —
            from lead-cast power and filmmaking form to
            screenplay, music, buzz and the unpredictable X-factor.
          </p>
        </header>

        <div className="birthChartGrid">

          {chart.map(([label, value], index) => (
            <article key={label}>

              <span>
                {String(index + 1).padStart(2, "0")}
              </span>

              <small>{label}</small>

              <p>{value}</p>

            </article>
          ))}

        </div>

      </section>


      <section className="horoscopeColumns">

        <article className="goodPlanets">

          <small>☀ THE GOOD PLANETS</small>

          <h2>
            What could make it work
          </h2>

          <p>{x.worksIf}</p>

        </article>

        <article className="warningSigns">

          <small>☁ THE WARNING SIGNS</small>

          <h2>
            What could send it sideways
          </h2>

          <p>{x.worries}</p>

        </article>

      </section>


      <section className="horoscopeGut">

        <small>MY GUT SAYS...</small>

        <p>{x.gut}</p>

      </section>


      <section className="fateForecast">

        <div className="fateLabel">
          <span>🔮</span>

          <div>
            <small>
              Movie....🤔hmm FATE FORECAST
            </small>

            <strong>
              BEFORE THE FIRST SHOW
            </strong>
          </div>
        </div>

        <div className="fatePrediction">

          <span>{x.forecastEmoji}</span>

          <h2>{x.forecast}</h2>

          <p>{x.forecastLine}</p>

        </div>

        <div className="forecastConfidence">

          <strong>{x.confidence}%</strong>

          <div>
            <span>MY CONFIDENCE</span>

            <p>
              Editorial conviction — not a statistical
              probability or box-office guarantee.
            </p>
          </div>

        </div>

      </section>


      <footer className="horoscopeDisclaimer">

        <strong>NO RATING.</strong>

        <p>
          I haven't watched the movie yet.
          This horoscope was written before release.
          When I finally watch it, we'll find out
          whether the stars were talking sense. 🤔
        </p>

        <Link href="/">
          BACK TO Movie....🤔hmm →
        </Link>

      </footer>

    </main>
  );
}
