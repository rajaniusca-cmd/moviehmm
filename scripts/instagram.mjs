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

const posterFile = path.join(
  root,
  "public",
  movie.poster.replace(/^\//, "")
);

if (!fs.existsSync(posterFile)) {
  console.error(`Poster not found: ${posterFile}`);
  process.exit(1);
}

const outDir = path.join(root, "public", "instagram", slug);
fs.mkdirSync(outDir, { recursive: true });

const W = 1080;
const H = 1350;

const PAPER = "#f1eadc";
const INK = "#171411";
const GOLD = "#a66d00";
const RED = "#8d2e27";
const GREEN = "#536f49";
const MUTED = "#6e665d";

const esc = (v = "") =>
  String(v)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function wrap(text = "", max = 38) {
  const words = String(text).trim().split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;

    if (candidate.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function lines(text, x, y, size, max, lh, opts = {}) {
  const {
    weight = 400,
    fill = INK,
    family = "Georgia, serif",
    italic = false
  } = opts;

  return wrap(text, max)
    .map((line, i) => `
      <text
        x="${x}"
        y="${y + i * lh}"
        font-family="${family}"
        font-size="${size}"
        font-weight="${weight}"
        ${italic ? 'font-style="italic"' : ""}
        fill="${fill}">
        ${esc(line)}
      </text>
    `)
    .join("");
}

function masthead(page, section) {
  return `
    <rect width="${W}" height="${H}" fill="${PAPER}" fill-opacity="0"/>

    <line x1="55" y1="52" x2="1025" y2="52"
          stroke="${INK}" stroke-width="5"/>

    <text x="55" y="105"
          font-family="Georgia, serif"
          font-size="45"
          font-weight="700"
          fill="${INK}">
      Movie....hmm
    </text>

    <text x="1025" y="101"
          text-anchor="end"
          font-family="Arial, sans-serif"
          font-size="15"
          font-weight="700"
          letter-spacing="3"
          fill="${GOLD}">
      THE INDEPENDENT TAKE
    </text>

    <line x1="55" y1="130" x2="1025" y2="130"
          stroke="#aaa195" stroke-width="1"/>

    <text x="55" y="166"
          font-family="Arial, sans-serif"
          font-size="13"
          font-weight="700"
          letter-spacing="2.5"
          fill="${GOLD}">
      ${esc(section)}
    </text>

    <text x="1025" y="166"
          text-anchor="end"
          font-family="Arial, sans-serif"
          font-size="13"
          font-weight="700"
          letter-spacing="2"
          fill="${MUTED}">
      ${page} / 5
    </text>
  `;
}

function footer() {
  return `
    <line x1="55" y1="1270" x2="1025" y2="1270"
          stroke="#aaa195"/>

    <text x="55" y="1310"
          font-family="Arial, sans-serif"
          font-size="14"
          font-weight="700"
          letter-spacing="2"
          fill="${INK}">
      MOVIEHMM.COM
    </text>

    <text x="1025" y="1310"
          text-anchor="end"
          font-family="Georgia, serif"
          font-size="16"
          font-style="italic"
          fill="${MUTED}">
      No hype. No hate. Just the movie.
    </text>
  `;
}

async function posterBuffer(width, height, position = "centre") {
  return sharp(posterFile)
    .resize(width, height, {
      fit: "cover",
      position
    })
    .jpeg({ quality: 94 })
    .toBuffer();
}

async function render(page, svg, composites = []) {
  const output = path.join(
    outDir,
    `${String(page).padStart(2, "0")}.jpg`
  );

  await sharp({
    create: {
      width: W,
      height: H,
      channels: 3,
      background: PAPER
    }
  })
    .composite([
      ...composites,
      { input: Buffer.from(svg), top: 0, left: 0 }
    ])
    .jpeg({ quality: 94, mozjpeg: true })
    .toFile(output);

  console.log(`Created ${output}`);
}

/* ======================================================
   SLIDE 1 — REAL POSTER HERO
   ====================================================== */

{
  const poster = await posterBuffer(970, 710, "centre");

  const svg = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">

    ${masthead(1, `${movie.language} · ${movie.year} · REVIEW`)}

    <rect x="55" y="195" width="970" height="710"
          fill="none" stroke="${INK}" stroke-width="2"/>

    <rect x="55" y="905" width="970" height="305"
          fill="${PAPER}"/>

    <text x="70" y="970"
          font-family="Georgia, serif"
          font-size="62"
          font-weight="700"
          fill="${INK}">
      ${esc(movie.title)}
    </text>

    <text x="70" y="1065"
          font-family="Georgia, serif"
          font-size="88"
          font-weight="700"
          fill="${GOLD}">
      ${esc(movie.score)} / 10
    </text>

    ${lines(
      movie.verdict,
      430, 1025,
      30, 31, 39,
      { weight: 700 }
    )}

    <text x="430" y="1175"
          font-family="Arial, sans-serif"
          font-size="13"
          font-weight="700"
          letter-spacing="2.5"
          fill="${GOLD}">
      SWIPE FOR THE TAKE →
    </text>

    ${footer()}

  </svg>`;

  await render(1, svg, [
    { input: poster, left: 55, top: 195 }
  ]);
}

/* ======================================================
   SLIDE 2 — THE THOUGHT + REAL POSTER CLIPPING
   ====================================================== */

{
  const poster = await posterBuffer(330, 480, "centre");

  const thought =
    movie.review?.[0] ||
    movie.dek;

  const svg = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">

    ${masthead(2, "MY TAKE")}

    <text x="55" y="275"
          font-family="Georgia, serif"
          font-size="72"
          font-weight="700"
          fill="${INK}">
      THE THOUGHT
    </text>

    <rect x="55" y="305" width="240" height="6" fill="${GOLD}"/>

    ${lines(
      thought,
      55, 400,
      39, 34, 52,
      { weight: 400 }
    )}

    <rect x="675" y="350"
          width="330" height="480"
          fill="none"
          stroke="${INK}"
          stroke-width="2"/>

    <text x="675" y="865"
          font-family="Georgia, serif"
          font-size="22"
          font-style="italic"
          fill="${MUTED}">
      The movie, through my lens.
    </text>

    <line x1="55" y1="1000" x2="1005" y2="1000"
          stroke="${INK}" stroke-width="3"/>

    ${lines(
      movie.dek,
      55, 1070,
      28, 59, 38,
      { italic: true, fill: MUTED }
    )}

    ${footer()}

  </svg>`;

  await render(2, svg, [
    { input: poster, left: 675, top: 350 }
  ]);
}

/* ======================================================
   SLIDE 3 — WHAT WORKED
   ====================================================== */

{
  const poster = await posterBuffer(290, 600, "centre");

  const svg = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">

    ${masthead(3, "THE GOOD STUFF")}

    <text x="55" y="285"
          font-family="Georgia, serif"
          font-size="70"
          font-weight="700"
          fill="${INK}">
      WHAT WORKED
    </text>

    <rect x="55" y="315" width="970" height="6" fill="${GREEN}"/>

    <text x="55" y="380"
          font-family="Arial, sans-serif"
          font-size="16"
          font-weight="700"
          letter-spacing="3"
          fill="${GREEN}">
      ✓ WHY THE FILM CONNECTS
    </text>

    ${lines(
      movie.works,
      55, 465,
      34, 39, 48,
      { weight: 400 }
    )}

    <rect x="735" y="425"
          width="290" height="600"
          fill="none"
          stroke="${INK}"
          stroke-width="2"/>

    <line x1="55" y1="1085" x2="1025" y2="1085"
          stroke="#aaa195"/>

    <text x="55" y="1145"
          font-family="Georgia, serif"
          font-size="30"
          font-style="italic"
          fill="${MUTED}">
      Good cinema leaves something behind.
    </text>

    ${footer()}

  </svg>`;

  await render(3, svg, [
    { input: poster, left: 735, top: 425 }
  ]);
}

/* ======================================================
   SLIDE 4 — WHAT HELD IT BACK
   ====================================================== */

{
  const poster = await posterBuffer(300, 470, "centre");

  const svg = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">

    ${masthead(4, "THE OTHER SIDE")}

    <text x="55" y="285"
          font-family="Georgia, serif"
          font-size="65"
          font-weight="700"
          fill="${INK}">
      WHAT HELD IT BACK
    </text>

    <rect x="55" y="315" width="970" height="6" fill="${RED}"/>

    <text x="55" y="380"
          font-family="Arial, sans-serif"
          font-size="16"
          font-weight="700"
          letter-spacing="3"
          fill="${RED}">
      × WHERE IT COULD HAVE GONE FURTHER
    </text>

    ${lines(
      movie.misses,
      55, 465,
      34, 41, 48,
      { weight: 400 }
    )}

    <rect x="705" y="650"
          width="300" height="470"
          fill="none"
          stroke="${INK}"
          stroke-width="2"/>

    <text x="55" y="1100"
          font-family="Georgia, serif"
          font-size="29"
          font-style="italic"
          fill="${MUTED}">
      Not a dismissal. A missed opportunity.
    </text>

    ${footer()}

  </svg>`;

  await render(4, svg, [
    { input: poster, left: 705, top: 650 }
  ]);
}

/* ======================================================
   SLIDE 5 — FINAL VERDICT
   ====================================================== */

{
  const poster = await posterBuffer(300, 440, "centre");

  const svg = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">

    ${masthead(5, "FINAL VERDICT")}

    <text x="55" y="330"
          font-family="Georgia, serif"
          font-size="145"
          font-weight="700"
          fill="${GOLD}">
      ${esc(movie.score)}
    </text>

    <text x="365" y="325"
          font-family="Georgia, serif"
          font-size="50"
          font-weight="700"
          fill="${INK}">
      / 10
    </text>

    <rect x="55" y="375" width="500" height="6" fill="${INK}"/>

    ${lines(
      movie.verdict,
      55, 475,
      45, 27, 58,
      { weight: 700 }
    )}

    <rect x="705" y="270"
          width="300" height="440"
          fill="none"
          stroke="${INK}"
          stroke-width="2"/>

    <line x1="55" y1="805" x2="1025" y2="805"
          stroke="#aaa195"/>

    <text x="55" y="885"
          font-family="Georgia, serif"
          font-size="33"
          fill="${INK}">
      I watched it.
    </text>

    <text x="55" y="935"
          font-family="Georgia, serif"
          font-size="33"
          fill="${INK}">
      I thought about it.
    </text>

    <text x="55" y="985"
          font-family="Georgia, serif"
          font-size="33"
          font-style="italic"
          fill="${GOLD}">
      The rest is between us.
    </text>

    <text x="55" y="1110"
          font-family="Arial, sans-serif"
          font-size="15"
          font-weight="700"
          letter-spacing="3"
          fill="${MUTED}">
      READ THE COMPLETE REVIEW
    </text>

    <text x="55" y="1170"
          font-family="Georgia, serif"
          font-size="45"
          font-weight="700"
          fill="${GOLD}">
      moviehmm.com
    </text>

    ${footer()}

  </svg>`;

  await render(5, svg, [
    { input: poster, left: 705, top: 270 }
  ]);
}

console.log("");
console.log(`DONE: Instagram newspaper carousel generated for ${movie.title}`);
console.log(`REAL POSTER USED: ${movie.poster}`);
