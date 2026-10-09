import Link from "next/link";
import catalog from "@/content/binge-file/catalog.json";

export default function BingeFileHome() {
  const featured = catalog.slice(0, 3);

  return (
    <section id="binge-file" className="dhSection shell">
      <div className="dhHead">
        <strong>THE BINGE FILE</strong>
        <small>LONG SEASONS. SHORT STORIES. YOUR TIME MATTERS.</small>
      </div>

      <div className="dhPosters">
        {featured.map((item) => (
          <Link href={`/binge-file/${item.slug}`} key={item.slug}>
            <div>
              <img src={item.poster} alt={item.title} />
            </div>
            <small>{item.language} · {item.category}</small>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <b>{item.verdict} →</b>
          </Link>
        ))}
      </div>

      <p style={{ marginTop: 24 }}>
        <Link href="/binge-file">EXPLORE THE BINGE FILE →</Link>
      </p>
    </section>
  );
}
