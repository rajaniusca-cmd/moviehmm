import fs from "fs";
import path from "path";
import sharp from "sharp";
import { execFileSync } from "child_process";

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: npm run reel -- <movie-slug>");
  process.exit(1);
}

const root = process.cwd();
const reviewFile = path.join(root,"content","reviews",`${slug}.json`);

if (!fs.existsSync(reviewFile)) {
  console.error(`Review not found: ${reviewFile}`);
  process.exit(1);
}

const m = JSON.parse(fs.readFileSync(reviewFile,"utf8"));

const poster = path.join(
  root,
  "public",
  m.poster.replace(/^\//,"")
);

if (!fs.existsSync(poster)) {
  console.error(`Poster not found: ${poster}`);
  process.exit(1);
}

const outDir = path.join(root,"public","instagram",slug);
const workDir = path.join(root,".reel-work",slug);

fs.mkdirSync(outDir,{recursive:true});
fs.rmSync(workDir,{recursive:true,force:true});
fs.mkdirSync(workDir,{recursive:true});

const W=1080;
const H=1920;

const PAPER="#eee6d7";
const INK="#171411";
const GOLD="#a66d00";
const RED="#96342c";
const GREEN="#526d48";
const MUTED="#675f56";

const esc=(v="")=>String(v)
  .replaceAll("&","&amp;")
  .replaceAll("<","&lt;")
  .replaceAll(">","&gt;");

function wrap(text,max=36){
  const words=String(text).trim().split(/\s+/);
  const result=[];
  let line="";

  for(const word of words){
    const candidate=line?`${line} ${word}`:word;

    if(candidate.length>max && line){
      result.push(line);
      line=word;
    } else {
      line=candidate;
    }
  }

  if(line) result.push(line);
  return result;
}

function lines(text,x,y,size,max,lh,{
  weight=400,
  color=INK,
  italic=false,
  limit=8
}={}){
  return wrap(text,max)
    .slice(0,limit)
    .map((line,i)=>`
      <text
        x="${x}"
        y="${y+i*lh}"
        font-family="Georgia,serif"
        font-size="${size}"
        font-weight="${weight}"
        ${italic?'font-style="italic"':""}
        fill="${color}">
        ${esc(line)}
      </text>
    `).join("");
}

function header(page,label){
  return `
    <rect width="${W}" height="${H}" fill="${PAPER}" fill-opacity="0"/>

    <line x1="55" y1="52" x2="1025" y2="52"
          stroke="${INK}" stroke-width="5"/>

    <text x="55" y="112"
          font-family="Georgia,serif"
          font-size="50"
          font-weight="700"
          fill="${INK}">
      Movie....hmm
    </text>

    <text x="1025" y="105"
          text-anchor="end"
          font-family="Arial,sans-serif"
          font-size="14"
          font-weight="700"
          letter-spacing="3"
          fill="${GOLD}">
      THE INDEPENDENT TAKE
    </text>

    <line x1="55" y1="140" x2="1025" y2="140"
          stroke="#aaa195"/>

    <text x="55" y="182"
          font-family="Arial,sans-serif"
          font-size="14"
          font-weight="700"
          letter-spacing="3"
          fill="${INK}">
      ${esc(label)}
    </text>

    <text x="1025" y="182"
          text-anchor="end"
          font-family="Arial,sans-serif"
          font-size="14"
          font-weight="700"
          fill="${GOLD}">
      ${page} / 5
    </text>
  `;
}

function footer(){
  return `
    <line x1="55" y1="1810" x2="1025" y2="1810"
          stroke="#aaa195"/>

    <text x="55" y="1860"
          font-family="Arial,sans-serif"
          font-size="14"
          font-weight="700"
          letter-spacing="3"
          fill="${INK}">
      MOVIEHMM.COM
    </text>

    <text x="1025" y="1860"
          text-anchor="end"
          font-family="Georgia,serif"
          font-size="17"
          font-style="italic"
          fill="${MUTED}">
      We watch. We think. We write.
    </text>
  `;
}

async function createPage(number,svg,composites=[]){
  const output=path.join(
    workDir,
    `page-${number}.jpg`
  );

  await sharp({
    create:{
      width:W,
      height:H,
      channels:3,
      background:PAPER
    }
  })
  .composite([
    ...composites,
    {
      input:Buffer.from(svg),
      left:0,
      top:0
    }
  ])
  .jpeg({quality:95})
  .toFile(output);

  console.log(`Page ${number}/5 created`);
  return output;
}

/* ======================================================
   PAGE 1 — FRONT PAGE
   ONLY PAGE USING MOVIE ARTWORK
   ====================================================== */

{
  const posterArt=await sharp(poster)
    .resize(970,1020,{
      fit:"cover",
      position:"centre"
    })
    .jpeg({quality:95})
    .toBuffer();

  const svg=`
  <svg width="${W}" height="${H}"
       xmlns="http://www.w3.org/2000/svg">

    ${header(1,`${m.language} · ${m.year} · REVIEW`)}

    <!-- Transparent window: authentic poster sits underneath -->
    <rect x="55" y="220"
          width="970" height="1020"
          fill="none"
          stroke="${INK}"
          stroke-width="2"/>

    <!-- Newspaper lower panel -->
    <rect x="55" y="1240"
          width="970" height="505"
          fill="${PAPER}"/>

    <text x="55" y="1330"
          font-family="Georgia,serif"
          font-size="82"
          font-weight="700"
          fill="${INK}">
      ${esc(m.title)}
    </text>

    <text x="55" y="1470"
          font-family="Georgia,serif"
          font-size="120"
          font-weight="700"
          fill="${GOLD}">
      ${esc(m.score)} / 10
    </text>

    ${lines(
      m.verdict,
      55,1565,
      41,35,53,
      {weight:700,limit:3}
    )}

    <line x1="55" y1="1695"
          x2="1025" y2="1695"
          stroke="${INK}"
          stroke-width="3"/>

    <text x="55" y="1750"
          font-family="Arial,sans-serif"
          font-size="15"
          font-weight="700"
          letter-spacing="4"
          fill="${GOLD}">
      THE REVIEW BEGINS →
    </text>

    ${footer()}

  </svg>`;

  await createPage(
    1,
    svg,
    [{
      input:posterArt,
      left:55,
      top:220
    }]
  );
}

/* ======================================================
   PAGE 2 — THE QUESTION
   ====================================================== */

{
  const svg=`
  <svg width="${W}" height="${H}"
       xmlns="http://www.w3.org/2000/svg">

    ${header(2,"THE QUESTION")}

    <text x="55" y="355"
          font-family="Georgia,serif"
          font-size="100"
          font-weight="700"
          fill="${INK}">
      THE
    </text>

    <text x="55" y="455"
          font-family="Georgia,serif"
          font-size="100"
          font-weight="700"
          fill="${RED}">
      QUESTION
    </text>

    <rect x="55" y="495"
          width="400" height="8"
          fill="${GOLD}"/>

    <text x="55" y="650"
          font-family="Georgia,serif"
          font-size="120"
          fill="${GOLD}">
      “
    </text>

    ${lines(
      "Honour without humanity is only fear wearing pride.",
      130,675,
      58,27,72,
      {weight:700,limit:4}
    )}

    <line x1="55" y1="1010"
          x2="1025" y2="1010"
          stroke="${INK}"
          stroke-width="4"/>

    ${lines(
      "The violence doesn't begin with a weapon. It begins much earlier — when reputation becomes more important than a person.",
      55,1110,
      38,45,53,
      {limit:6}
    )}

    <rect x="55" y="1485"
          width="970" height="135"
          fill="${INK}"/>

    <text x="540" y="1568"
          text-anchor="middle"
          font-family="Arial,sans-serif"
          font-size="20"
          font-weight="700"
          letter-spacing="5"
          fill="${PAPER}">
      CASTE · HONOUR · FEAR · IDENTITY
    </text>

    <text x="55" y="1720"
          font-family="Georgia,serif"
          font-size="28"
          font-style="italic"
          fill="${MUTED}">
      Some questions survive long after the credits.
    </text>

    ${footer()}

  </svg>`;

  await createPage(2,svg);
}


/* ======================================================
   PAGE 3 — WHAT WORKED
   ====================================================== */

{
  const svg=`
  <svg width="${W}" height="${H}"
       xmlns="http://www.w3.org/2000/svg">

    ${header(3,"THE GOOD STUFF")}

    <text x="55" y="350"
          font-family="Georgia,serif"
          font-size="88"
          font-weight="700"
          fill="${INK}">
      WHAT WORKED
    </text>

    <rect x="55" y="390"
          width="970" height="8"
          fill="${GREEN}"/>


    <text x="55" y="490"
          font-family="Arial,sans-serif"
          font-size="17"
          font-weight="700"
          letter-spacing="4"
          fill="${GREEN}">
      PERFORMANCE
    </text>

    <text x="55" y="555"
          font-family="Georgia,serif"
          font-size="39"
          font-weight="700"
          fill="${INK}">
      Sananth gives the film its emotional soul.
    </text>


    <line x1="55" y1="655"
          x2="1025" y2="655"
          stroke="#aaa195"/>


    <text x="55" y="735"
          font-family="Arial,sans-serif"
          font-size="17"
          font-weight="700"
          letter-spacing="4"
          fill="${GREEN}">
      RISHIKANTH
    </text>

    ${lines(
      "There is genuine leading-man potential here.",
      55,800,
      38,42,50,
      {limit:3}
    )}


    <line x1="55" y1="930"
          x2="1025" y2="930"
          stroke="#aaa195"/>


    <text x="55" y="1010"
          font-family="Arial,sans-serif"
          font-size="17"
          font-weight="700"
          letter-spacing="4"
          fill="${GREEN}">
      ILAIYARAAJA
    </text>

    ${lines(
      "Music that doesn't accompany nostalgia. It creates it.",
      55,1075,
      38,42,50,
      {weight:700,limit:3}
    )}


    <line x1="55" y1="1220"
          x2="1025" y2="1220"
          stroke="#aaa195"/>


    <text x="55" y="1300"
          font-family="Arial,sans-serif"
          font-size="17"
          font-weight="700"
          letter-spacing="4"
          fill="${GREEN}">
      THE WORLD
    </text>

    ${lines(
      "Rustic. Rough. Unpolished. Exactly as this story needs.",
      55,1365,
      38,42,50,
      {limit:3}
    )}

    <rect x="55" y="1580"
          width="970" height="115"
          fill="${INK}"/>

    <text x="540" y="1652"
          text-anchor="middle"
          font-family="Georgia,serif"
          font-size="27"
          font-style="italic"
          fill="${PAPER}">
      Good cinema leaves something behind.
    </text>

    ${footer()}

  </svg>`;

  await createPage(3,svg);
}


/* ======================================================
   PAGE 4 — WHAT HELD IT BACK
   ====================================================== */

{
  const svg=`
  <svg width="${W}" height="${H}"
       xmlns="http://www.w3.org/2000/svg">

    ${header(4,"THE OTHER SIDE")}

    <text x="55" y="350"
          font-family="Georgia,serif"
          font-size="76"
          font-weight="700"
          fill="${INK}">
      WHAT HELD IT BACK
    </text>

    <rect x="55" y="390"
          width="970" height="8"
          fill="${RED}"/>


    <text x="55" y="510"
          font-family="Arial,sans-serif"
          font-size="19"
          font-weight="700"
          letter-spacing="5"
          fill="${RED}">
      FRIENDSHIP → LOVE
    </text>


    <text x="55" y="650"
          font-family="Georgia,serif"
          font-size="52"
          font-weight="700"
          fill="${INK}">
      I believe the destination.
    </text>

    <text x="55" y="735"
          font-family="Georgia,serif"
          font-size="52"
          font-weight="700"
          fill="${INK}">
      I don't completely believe
    </text>

    <text x="55" y="810"
          font-family="Georgia,serif"
          font-size="52"
          font-weight="700"
          fill="${INK}">
      how quickly we reached it.
    </text>


    <line x1="55" y1="900"
          x2="1025" y2="900"
          stroke="#aaa195"/>


    <text x="55" y="1000"
          font-family="Georgia,serif"
          font-size="39"
          font-weight="700"
          fill="${INK}">
      Karthi needed another emotional bridge.
    </text>


    <text x="110" y="1130"
          font-family="Georgia,serif"
          font-size="37"
          font-style="italic"
          fill="${MUTED}">
      A silence.
    </text>

    <text x="110" y="1205"
          font-family="Georgia,serif"
          font-size="37"
          font-style="italic"
          fill="${MUTED}">
      A jealousy.
    </text>

    <text x="110" y="1280"
          font-family="Georgia,serif"
          font-size="37"
          font-style="italic"
          fill="${MUTED}">
      A closeness he couldn't explain.
    </text>


    <rect x="55" y="1435"
          width="970" height="195"
          fill="${RED}"/>

    <text x="540" y="1515"
          text-anchor="middle"
          font-family="Georgia,serif"
          font-size="31"
          font-weight="700"
          fill="${PAPER}">
      THE DESTINATION WORKS.
    </text>

    <text x="540" y="1575"
          text-anchor="middle"
          font-family="Georgia,serif"
          font-size="31"
          font-weight="700"
          fill="${PAPER}">
      THE ROAD NEEDED ANOTHER KILOMETRE.
    </text>


    ${footer()}

  </svg>`;

  await createPage(4,svg);
}


/* ======================================================
   PAGE 5 — FINAL VERDICT
   ====================================================== */

{
  const svg=`
  <svg width="${W}" height="${H}"
       xmlns="http://www.w3.org/2000/svg">

    ${header(5,"THE VERDICT")}

    <text x="55" y="350"
          font-family="Georgia,serif"
          font-size="88"
          font-weight="700"
          fill="${INK}">
      FINAL VERDICT
    </text>

    <rect x="55" y="390"
          width="970" height="8"
          fill="${GOLD}"/>


    <text x="55" y="620"
          font-family="Georgia,serif"
          font-size="180"
          font-weight="700"
          fill="${GOLD}">
      ${esc(m.score)}
    </text>

    <text x="440" y="605"
          font-family="Georgia,serif"
          font-size="65"
          font-weight="700"
          fill="${INK}">
      / 10
    </text>


    ${lines(
      m.verdict,
      55,760,
      53,30,66,
      {weight:700,limit:4}
    )}


    <line x1="55" y1="1040"
          x2="1025" y2="1040"
          stroke="${INK}"
          stroke-width="4"/>


    <text x="55" y="1130"
          font-family="Georgia,serif"
          font-size="38"
          fill="${INK}">
      Some films entertain.
    </text>

    <text x="55" y="1195"
          font-family="Georgia,serif"
          font-size="38"
          fill="${INK}">
      Some films provoke.
    </text>

    <text x="55" y="1300"
          font-family="Georgia,serif"
          font-size="43"
          font-weight="700"
          fill="${INK}">
      The better ones make a question
    </text>

    <text x="55" y="1365"
          font-family="Georgia,serif"
          font-size="43"
          font-weight="700"
          fill="${INK}">
      follow you home.
    </text>


    <rect x="55" y="1490"
          width="970" height="180"
          fill="${INK}"/>

    <text x="540" y="1550"
          text-anchor="middle"
          font-family="Arial,sans-serif"
          font-size="14"
          font-weight="700"
          letter-spacing="4"
          fill="${GOLD}">
      READ THE COMPLETE REVIEW
    </text>

    <text x="540" y="1620"
          text-anchor="middle"
          font-family="Georgia,serif"
          font-size="48"
          font-weight="700"
          fill="${PAPER}">
      MOVIEHMM.COM
    </text>

    <text x="540" y="1740"
          text-anchor="middle"
          font-family="Arial,sans-serif"
          font-size="16"
          font-weight="700"
          letter-spacing="5"
          fill="${GOLD}">
      WE WATCH. WE THINK. WE WRITE.
    </text>


    ${footer()}

  </svg>`;

  await createPage(5,svg);
}

/* ======================================================
   BUILD VIDEO
   5 newspaper pages × 3 seconds
   ====================================================== */

const clips=[];

/* Reading time per newspaper page */
const sceneDurations = [5, 6, 7, 7, 5];

for(let i=1;i<=5;i++){

  const duration = sceneDurations[i - 1];
  const frames = Math.round(duration * 30);

  const input=path.join(
    workDir,
    `page-${i}.jpg`
  );

  const output=path.join(
    workDir,
    `clip-${i}.mp4`
  );

  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-loop","1",
      "-i",input,

      "-vf",
      [
        "scale=1080:1920",
        "zoompan=" +
          "z='min(zoom+0.00022,1.012)':" +
          "x='iw/2-(iw/zoom/2)':" +
          "y='ih/2-(ih/zoom/2)':" +
          `d=${frames}:` +
          "s=1080x1920:" +
          "fps=30",
        "format=yuv420p"
      ].join(","),

      "-t",String(duration),
      "-r","30",

      "-c:v","libx264",
      "-preset","medium",
      "-crf","18",
      "-pix_fmt","yuv420p",

      output
    ],
    {stdio:"ignore"}
  );

  clips.push(output);

  console.log(`Video scene ${i}/5 created`);
}


/* Join scenes — preserve individual scene durations */

const finalReel = path.join(
  outDir,
  "reel.mp4"
);

execFileSync(
  "ffmpeg",
  [
    "-y",

    "-i", clips[0],
    "-i", clips[1],
    "-i", clips[2],
    "-i", clips[3],
    "-i", clips[4],

    "-filter_complex",
    "[0:v]setpts=PTS-STARTPTS[v0];" +
    "[1:v]setpts=PTS-STARTPTS[v1];" +
    "[2:v]setpts=PTS-STARTPTS[v2];" +
    "[3:v]setpts=PTS-STARTPTS[v3];" +
    "[4:v]setpts=PTS-STARTPTS[v4];" +
    "[v0][v1][v2][v3][v4]concat=n=5:v=1:a=0[v]",

    "-map", "[v]",

    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "18",
    "-pix_fmt", "yuv420p",

    "-movflags", "+faststart",

    finalReel
  ],
  { stdio: "inherit" }
);

console.log("Five newspaper scenes joined.");

/* ======================================================
   ADD Movie....hmm SIGNATURE MUSIC
   ====================================================== */

const musicFile = path.join(
  root,
  "public",
  "audio",
  "moviehmm-review-bed.mp3"
);

if (fs.existsSync(musicFile)) {

  const silentReel = path.join(
    outDir,
    "reel-silent.mp4"
  );

  fs.renameSync(finalReel, silentReel);

  execFileSync(
    "ffmpeg",
    [
      "-y",

      /* 30-second video */
      "-i", silentReel,

      /* loop music for as long as necessary */
      "-stream_loop", "-1",
      "-i", musicFile,

      "-filter_complex",
      "[1:a]" +
      "atrim=0:30," +
      "asetpts=PTS-STARTPTS," +
      "volume=0.20," +
      "afade=t=in:st=0:d=1.5," +
      "afade=t=out:st=27:d=3" +
      "[music]",

      "-map", "0:v:0",
      "-map", "[music]",

      "-c:v", "copy",
      "-c:a", "aac",
      "-b:a", "192k",

      "-t", "30",

      "-movflags", "+faststart",

      finalReel
    ],
    { stdio: "inherit" }
  );

  fs.unlinkSync(silentReel);

  console.log("");
  console.log("Music: Movie....hmm review bed added");
  console.log("Final duration: 30 seconds");
}
