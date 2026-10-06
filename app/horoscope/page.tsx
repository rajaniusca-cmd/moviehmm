import Link from "next/link";
import { getAllCrystalBalls } from "@/lib/crystalBall";
import HoroscopeArchive from "@/components/HoroscopeArchive";

export default function HoroscopeLanding() {
  const movies = getAllCrystalBalls();

  return (
    <>
      <header className="dhHeader shell">

        <Link href="/" className="dhBrand">
          Movie....🤔<em>hmm</em>
          <small>WE WATCH. WE THINK. WE WRITE.</small>
        </Link>

        <nav>
          <Link href="/">Home</Link>
          <Link href="/reviews">Reviews</Link>
          <Link href="/horoscope">Horoscope</Link>
        </nav>

      </header>

      <main className="horoscopeLanding shell">

        <header className="horoscopeLandingHero horoscopeCompactHero">

          <div className="horoscopeCompactTop">
            <div>
              <span>🔮 UPCOMING MOVIE HOROSCOPE</span>

              <h1>
                I call it
                <em>before I watch it.</em>
              </h1>
            </div>

            <div className="horoscopeNine">
              <strong>9</strong>
              <span>
                MOVIE PLANETS<br/>
                ONE FATE FORECAST
              </span>
            </div>
          </div>

          <div className="horoscopeCompactDeck">
            <p>
              Cast. Director. Writing. Music. Chemistry. Genre.
              Buzz. Release climate. X-factor.
            </p>

            <strong>
              Prediction first.
              <span>Reality later. 🤔</span>
            </strong>
          </div>

        </header>


        <section className="horoscopePromise">

          <strong>THE RULE</strong>

          <p>
            The call is locked before release.
            No rewriting history after the first show.
          </p>

          <span>
            Prediction first. Reality later. 🤔
          </span>

        </section>


        <section className="horoscopeLandingSection">

          <header className="horoscopeSectionHead">
            <div>
              <span>01</span>
              <strong>THE FORECAST DESK</strong>
            </div>

            <small>
              SEARCH THE FUTURE · CHECK THE CALL
            </small>
          </header>

          <HoroscopeArchive movies={movies} /></section>


        <section className="horoscopeMethod">

          <header>
            <small>HOW I READ THE SIGNS</small>

            <h2>
              Nine planets.<br/>
              <em>One movie fate.</em>
            </h2>
          </header>

          <div className="horoscopeMethodGrid">

            {[
              ["01","STAR POWER","Lead cast & theatrical pull"],
              ["02","DIRECTOR FORM","The filmmaker behind the promise"],
              ["03","WRITING","Story & screenplay potential"],
              ["04","MUSIC","Songs, score & sonic identity"],
              ["05","CHEMISTRY","Does the combination feel right?"],
              ["06","GENRE / WORLD","What kind of experience is it selling?"],
              ["07","BUZZ","Expectation without getting trapped by hype"],
              ["08","RELEASE CLIMATE","Timing, competition & audience mood"],
              ["09","X-FACTOR","The thing nobody can completely calculate"]
            ].map(([n,title,copy]) => (

              <article key={n}>
                <span>{n}</span>
                <strong>{title}</strong>
                <p>{copy}</p>
              </article>

            ))}

          </div>

        </section>


        <section className="horoscopeReality">

          <span>COMING NEXT</span>

          <h2>
            Horoscope
            <em> vs Reality.</em>
          </h2>

          <p>
            When these movies release, the original prediction
            stays untouched. My actual review and the movie's
            real-world fate will sit beside it.
          </p>

          <strong>
            Let's see whether the stars were talking sense. 🔮
          </strong>

        </section>

      </main>
    </>
  );
}
