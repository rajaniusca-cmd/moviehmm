import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllPostmortems,
  getPostmortem,
} from "@/lib/postmortem";

export function generateStaticParams() {
  return getAllPostmortems().map((x) => ({
    slug: x.slug,
  }));
}

export default async function PostmortemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const x = getPostmortem(slug);

  if (!x) notFound();

  const departments = [
    ["HERO", x.hero],
    ["HEROINE", x.heroine],
    ["VILLAIN / CONFLICT", x.villain],
    ["DIRECTOR", x.director],
    ["WRITING", x.writing],
    ["MUSIC / BGM", x.music],
    ["SONGS", x.songs],
    ["EDITING", x.editing],
    ["CINEMATOGRAPHY", x.cinematography],
    ["PRODUCER", x.producer],
  ];

  const lessons = [
    ["HERO", x.heroLesson],
    ["DIRECTOR", x.directorLesson],
    ["WRITER", x.writerLesson],
    ["MUSIC", x.musicLesson],
    ["EDITOR", x.editorLesson],
    ["PRODUCER", x.producerLesson],
  ];

  return (
    <main className="postmortemPage shell">

      <Link href="/postmortem" className="back">
        ← AFTER THE CREDITS
      </Link>

      <header className="pmHero">

        <div className="pmPoster">
          <img src={x.poster} alt={x.title} />
        </div>

        <div className="pmHeroCopy">

          <span className="pmKicker">
            🎬 THE Movie....🤔hmm POSTMORTEM
          </span>

          <small>{x.language} · AFTER RELEASE</small>

          <h1>{x.title}</h1>

          <div className={`pmDiagnosis pm${x.status}`}>
            <span>{x.emoji}</span>

            <div>
              <small>FINAL DIAGNOSIS</small>
              <strong>{x.diagnosis}</strong>
            </div>
          </div>

          <p className="pmCaption">
            {x.caption}
          </p>

        </div>

      </header>


      <section className="pmAudience">

        <span>AUDIENCE REPORT</span>

        <h2>
          Who connected.
          <em> Who didn't. Why.</em>
        </h2>

        <p>{x.audienceSplit}</p>

      </section>


      <section className="pmTimeline">

        <header>
          <small>THE FILM ON THE TABLE</small>
          <h2>Where did the pulse change?</h2>
        </header>

        <div className="pmTimelineGrid">

          <article>
            <span>01</span>
            <strong>FIRST HALF</strong>
            <p>{x.firstHalf}</p>
          </article>

          <article>
            <span>02</span>
            <strong>INTERVAL</strong>
            <p>{x.interval}</p>
          </article>

          <article>
            <span>03</span>
            <strong>SECOND HALF</strong>
            <p>{x.secondHalf}</p>
          </article>

        </div>

      </section>


      <section className="pmWorkedFailed">

        <article className="pmWorked">
          <small>✓ WHAT WORKED</small>
          <p>{x.worked}</p>
        </article>

        <article className="pmFailed">
          <small>× WHAT WENT WRONG</small>
          <p>{x.failed}</p>
        </article>

      </section>


      <section className="pmDepartments">

        <header>
          <small>DEPARTMENT BY DEPARTMENT</small>

          <h2>
            Nobody escapes
            <em> the table.</em>
          </h2>
        </header>

        <div className="pmDepartmentGrid">

          {departments.map(([name, copy], i) => (
            <article key={name}>

              <span>
                {String(i + 1).padStart(2, "0")}
              </span>

              <strong>{name}</strong>

              <p>{copy}</p>

            </article>
          ))}

        </div>

      </section>


      <section className="pmLessons">

        <header>
          <small>FOR THE NEXT FILM</small>

          <h2>
            What should they
            <em> learn?</em>
          </h2>
        </header>

        <div className="pmLessonGrid">

          {lessons.map(([name, copy]) => (
            <article key={name}>
              <strong>{name}</strong>
              <p>{copy}</p>
            </article>
          ))}

        </div>

      </section>


      <section className="pmOneChange">

        <small>IF I COULD CHANGE ONE THING</small>

        <blockquote>
          {x.oneChange}
        </blockquote>

      </section>


      <section className="pmFinal">

        <span>{x.emoji}</span>

        <div>
          <small>THE FINAL POSTMORTEM</small>
          <p>{x.finalDiagnosis}</p>
        </div>

      </section>


      <footer className="pmFooter">

        <p>
          The review tells you whether it worked.
          <strong> The Postmortem asks why.</strong>
        </p>

        <Link href="/postmortem">
          MORE POSTMORTEMS →
        </Link>

        <Link href={`/reviews/${x.movieSlug}`}>
          READ THE ORIGINAL REVIEW →
        </Link>

      </footer>

    </main>
  );
}
