import fs from "fs";
import path from "path";

export type Postmortem = {
  title: string;
  slug: string;
  movieSlug: string;
  poster: string;
  language: string;

  diagnosis: string;
  status: "RED" | "ORANGE" | "YELLOW" | "GREEN";
  emoji: string;
  caption: string;

  audienceSplit: string;
  firstHalf: string;
  interval: string;
  secondHalf: string;

  hero: string;
  heroine: string;
  villain: string;
  director: string;
  writing: string;
  music: string;
  songs: string;
  editing: string;
  cinematography: string;
  producer: string;

  worked: string;
  failed: string;

  heroLesson: string;
  directorLesson: string;
  writerLesson: string;
  musicLesson: string;
  editorLesson: string;
  producerLesson: string;

  oneChange: string;
  finalDiagnosis: string;

  publishedDate: string;
};

export function getAllPostmortems(): Postmortem[] {
  const dir = path.join(process.cwd(), "content/postmortem");

  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) =>
      JSON.parse(
        fs.readFileSync(path.join(dir, f), "utf8")
      )
    )
    .sort((a, b) =>
      b.publishedDate.localeCompare(a.publishedDate)
    );
}

export function getPostmortem(slug: string) {
  return getAllPostmortems().find(
    (x) => x.slug === slug
  );
}
