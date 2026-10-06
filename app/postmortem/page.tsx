import Link from "next/link";
import { getAllPostmortems } from "@/lib/postmortem";
import PostmortemArchive from "@/components/PostmortemArchive";

export default function PostmortemLanding() {
  const postmortems = getAllPostmortems();

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
          <Link href="/horoscope">Horoscope 🔮</Link>
          <Link href="/postmortem">Postmortem 🎬</Link>
        </nav>

      </header>

      <main className="pmLanding shell">

        <header className="pmLandingHero">

          <span>🎬 AFTER THE CREDITS</span>

          <h1>
            The movie is over.
            <em>Now let's find out why.</em>
          </h1>

          <div>
            <p>
              Reviews tell us whether a movie worked.
              Postmortem opens it up after release —
              audience reaction, first half, interval,
              second half, performances, writing, music,
              editing and what every department should
              learn before the next film.
            </p>

            <strong>
              Hits teach.
              <em>Flops teach more.</em>
            </strong>
          </div>

        </header>


        <section className="pmLandingRule">

          <strong>THE RULE</strong>

          <p>
            No fan wars. No obituary. No victory lap.
            The purpose is to understand the result.
          </p>

          <span>
            What worked → What failed → What next.
          </span>

        </section>


        <section className="pmLandingList">

          <header>
            <div>
              <span>01</span>
              <strong>ON THE TABLE</strong>
            </div>

            <small>
              THE CREDITS ROLLED. THE LEARNING SHOULDN'T.
            </small>
          </header>

          <PostmortemArchive movies={postmortems} /></section>


        <section className="pmLandingEnd">

          <span>THE POINT</span>

          <h2>
            Don't just ask
            <em>“Hit or flop?”</em>
          </h2>

          <p>
            Ask what the actor, director, writer,
            composer, editor and producer should carry
            into their next film — and what they should
            leave behind.
          </p>

        </section>

      </main>
    </>
  );
}
