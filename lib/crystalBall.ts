import fs from "fs";
import path from "path";

export type CrystalBall = {
  title: string;
  slug: string;
  language: string;
  poster: string;
  releaseDate: string;

  call: string;
  emoji: string;
  hook: string;

  why: string;
  gut: string;
  worksIf: string;
  worries: string;

  forecast: string;
  forecastEmoji: string;
  forecastLine: string;
  confidence: number;

  starPower: string;
  directorForm: string;
  musicFactor: string;
  genreWorld: string;
  combination: string;
  buzz: string;

  publishedDate: string;
};

export function getAllCrystalBalls(): CrystalBall[] {
  const dir = path.join(process.cwd(), "content/crystal-ball");

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

export function getCrystalBall(slug: string) {
  return getAllCrystalBalls().find(
    (item) => item.slug === slug
  );
}
