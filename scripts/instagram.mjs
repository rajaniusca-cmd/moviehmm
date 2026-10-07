import fs from "fs";
import path from "path";
import sharp from "sharp";

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: npm run instagram -- <movie-slug>");
  process.exit(1);
}

const root = process.cwd();
const reviewFile = path.join(root, "content", "reviews", `${slug}.json`);

if (!fs.existsSync(reviewFile)) {
  console.error(`Review not found: ${reviewFile}`);
  process.exit(1);
}

const movie = JSON.parse(fs.readFileSync(reviewFile, "utf8"));

const outputDir = path.join(root, "public", "instagram", slug);
fs.mkdirSync(outputDir, { recursive: true });

const WIDTH = 1080;
const HEIGHT = 1350;

const esc = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const wrap = (text = "", max = 34) => {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;

    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);
  return lines;
};

const textLines = (text, x, y, size, max, lineHeight, weight = 400) =>
  wrap(text, max)
    .map(
      (line, i) =>
        `<text x="${x}" y="${y + i * lineHeight}"
          font-family="Georgia, serif"
          font-size="${size}"
          font-weight="${weight}"
          fill="#171411">${esc(line)}</text>`
    )
    .join("");

const base = (page, kicker, body) => `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">

  <rect width="1080" height="1350" fill="#eee7da"/>

  <line x1="65" y1="75" x2="1015" y2="75"
        stroke="#171411" stroke-width="5"/>

  <text x="65" y="132"
        font-family="Georgia, serif"
        font-size="44"
        font-weight="700"
        fill="#171411">
    Movie....hmm
  </text>

  <text x="1015" y="128"
        text-anchor="end"
        font-family="Arial, sans-serif"
        font-size="18"
        font-weight="700"
        letter-spacing="3"
        fill="#9b6500">
    THE INDEPENDENT TAKE
  </text>

  <line x1="65" y1="165" x2="1015" y2="165"
        stroke="#8d857b" stroke-width="1"/>

  <text x="65" y="215"
        font-family="Arial, sans-serif"
        font-size="17"
        font-weight="700"
        letter-spacing="3"
        fill="#9b6500">
    ${esc(kicker)}
  </text>

  ${body}

  <line x1="65" y1="1260" x2="1015" y2="1260"
        stroke="#8d857b" stroke-width="1"/>

  <text x="65" y="1305"
        font-family="Arial, sans-serif"
        font-size="16"
        font-weight="700"
        letter-spacing="2"
        fill="#171411">
    MOVIEHMM.COM
  </text>

  <text x="1015" y="1305"
        text-anchor="end"
        font-family="Arial, sans-serif"
        font-size="16"
        font-weight="700"
        fill="#9b6500">
    ${page} / 5
  </text>

</svg>`;

async function save(page, svg) {
  const file = path.join(
    outputDir,
    `${String(page).padStart(2, "0")}.jpg`
  );

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(file);

  console.log(`Created ${file}`);
}

/* PAGE 1 */

await save(
  1,
  base(
    1,
    `${movie.language} · ${movie.year} · REVIEW`,
    `
      <text x="65" y="330"
            font-family="Georgia, serif"
            font-size="100"
            font-weight="700"
            fill="#171411">${esc(movie.title)}</text>

      <text x="65" y="470"
            font-family="Georgia, serif"
            font-size="120"
            font-weight="700"
            fill="#9b6500">${esc(movie.score)} / 10</text>

      ${textLines(movie.verdict,65,590,45,32,57,700)}

      <line x1="65" y1="810" x2="1015" y2="810"
            stroke="#171411" stroke-width="4"/>

      ${textLines(movie.dek,65,890,35,48,48,400)}

      <text x="65" y="1190"
            font-family="Arial, sans-serif"
            font-size="16"
            font-weight="700"
            letter-spacing="3"
            fill="#9b6500">
        SWIPE FOR THE TAKE →
      </text>
    `
  )
);

/* PAGE 2 */

await save(
  2,
  base(
    2,
    "MY TAKE",
    `
      <text x="65" y="350"
            font-family="Georgia, serif"
            font-size="72"
            font-weight="700"
            fill="#171411">
        THE THOUGHT
      </text>

      <line x1="65" y1="400" x2="350" y2="400"
            stroke="#9b6500" stroke-width="6"/>

      ${textLines(movie.review?.[0] || movie.dek,65,500,42,43,58,400)}

      <text x="65" y="1110"
            font-family="Georgia, serif"
            font-size="31"
            font-style="italic"
            fill="#675f57">
        I watched it. I thought about it.
      </text>

      <text x="65" y="1160"
            font-family="Georgia, serif"
            font-size="31"
            font-style="italic"
            fill="#9b6500">
        The rest is between us.
      </text>
    `
  )
);

/* PAGE 3 */

await save(
  3,
  base(
    3,
    "WHAT WORKED",
    `
      <text x="65" y="350"
            font-family="Georgia, serif"
            font-size="76"
            font-weight="700"
            fill="#171411">
        WHAT WORKED
      </text>

      <rect x="65" y="400" width="950" height="6" fill="#56764c"/>

      <text x="65" y="500"
            font-family="Arial, sans-serif"
            font-size="22"
            font-weight="700"
            letter-spacing="3"
            fill="#56764c">
        ✓ THE GOOD STUFF
      </text>

      ${textLines(movie.works,65,590,38,48,54,400)}
    `
  )
);

/* PAGE 4 */

await save(
  4,
  base(
    4,
    "WHAT HELD IT BACK",
    `
      <text x="65" y="350"
            font-family="Georgia, serif"
            font-size="72"
            font-weight="700"
            fill="#171411">
        WHAT HELD IT BACK
      </text>

      <rect x="65" y="400" width="950" height="6" fill="#8e332b"/>

      <text x="65" y="500"
            font-family="Arial, sans-serif"
            font-size="22"
            font-weight="700"
            letter-spacing="3"
            fill="#8e332b">
        × WHERE IT MISSED
      </text>

      ${textLines(movie.misses,65,590,38,48,54,400)}
    `
  )
);

/* PAGE 5 */

await save(
  5,
  base(
    5,
    "FINAL VERDICT",
    `
      <text x="540" y="420"
            text-anchor="middle"
            font-family="Georgia, serif"
            font-size="160"
            font-weight="700"
            fill="#9b6500">
        ${esc(movie.score)}
      </text>

      <text x="540" y="475"
            text-anchor="middle"
            font-family="Arial, sans-serif"
            font-size="24"
            font-weight="700"
            letter-spacing="5"
            fill="#171411">
        OUT OF 10
      </text>

      <line x1="250" y1="540" x2="830" y2="540"
            stroke="#171411" stroke-width="4"/>

      ${textLines(movie.verdict,150,660,48,30,62,700)}

      <text x="540" y="980"
            text-anchor="middle"
            font-family="Georgia, serif"
            font-size="33"
            fill="#171411">
        Full review at
      </text>

      <text x="540" y="1040"
            text-anchor="middle"
            font-family="Georgia, serif"
            font-size="48"
            font-weight="700"
            fill="#9b6500">
        moviehmm.com
      </text>

      <text x="540" y="1160"
            text-anchor="middle"
            font-family="Arial, sans-serif"
            font-size="18"
            font-weight="700"
            letter-spacing="3"
            fill="#171411">
        NO HYPE. NO HATE. JUST THE MOVIE.
      </text>
    `
  )
);

console.log("");
console.log(`DONE: 5 Instagram slides generated for ${movie.title}`);
