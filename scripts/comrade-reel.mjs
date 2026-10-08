import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const root = process.cwd();
const slug = "comrade-kalyan";
const W = 1080, H = 1920;
const PAPER = "#f1eadc";
const INK = "#171411";
const GOLD = "#a66d00";
const RED = "#96342c";
const GREEN = "#526d48";
const MUTED = "#665f57";

const data = JSON.parse(fs.readFileSync(
  path.join(root, "content/crystal-ball", `${slug}.json`), "utf8"
));

const poster = path.join(root, "public", data.poster.replace(/^\//, ""));
const dir = path.join(root, "public/reels", slug);
const work = path.join(root, ".reel-work", slug);

fs.mkdirSync(dir, { recursive: true });
fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(work, { recursive: true });

if (!fs.existsSync(poster)) throw new Error(`Poster missing: ${poster}`);

const audioDir = path.join(root, "public/audio");
const downloads = path.join(process.env.HOME, "Downloads");
const music = path.join(audioDir, "comrade-kalyan-review-bed.mp3");

if (!fs.existsSync(music)) {
  const found = fs.readdirSync(downloads).find(f =>
    f.startsWith("paulyudin-hard-rock-rebel-154660") &&
    f.toLowerCase().endsWith(".mp3")
  );
  if (!found) throw new Error("Hard Rock Rebel MP3 missing from Downloads");
  fs.mkdirSync(audioDir, { recursive: true });
  fs.copyFileSync(path.join(downloads, found), music);
}

const esc = s => String(s ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function txt(s,x,y,size=42,color=INK,weight=700,anchor="start") {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}"
    font-family="Georgia,serif" font-size="${size}"
    font-weight="${weight}" fill="${color}">${esc(s)}</text>`;
}

function lines(s,x,y,size=43,max=37,leading=62,limit=8,color=INK) {
  const words=String(s ?? "").trim().split(/\s+/);
  const rows=[];
  let row="";
  for(const word of words) {
    const next=row?row+" "+word:word;
    if(next.length>max && row) {
      rows.push(row); row=word;
    } else row=next;
  }
  if(row) rows.push(row);
  return rows.slice(0,limit).map((r,i)=>
    txt(r,x,y+i*leading,size,color,400)
  ).join("");
}

function header(n,section) {
  return `
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  <line x1="55" y1="45" x2="1025" y2="45"
        stroke="${INK}" stroke-width="5"/>
  ${txt("Movie....hmm",55,112,52)}
  ${txt("THE INDEPENDENT TAKE",1025,105,17,GOLD,700,"end")}
  <line x1="55" y1="145" x2="1025" y2="145"
        stroke="#b7aa98"/>
  ${txt(section,55,200,22,GOLD)}
  ${txt(`${n} / 5`,1025,200,22,GOLD,700,"end")}
  <line x1="55" y1="1810" x2="1025" y2="1810"
        stroke="#b7aa98"/>
  ${txt("MOVIEHMM.COM",55,1860,22)}
  ${txt("WE WATCH. WE THINK. WE WRITE.",1025,1860,18,MUTED,700,"end")}
  `;
}

async function save(n,body,art=null) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"
    width="${W}" height="${H}">
    ${header(n,[
      "BEFORE THE CREDITS · MOVIE HOROSCOPE",
      "THE GOOD OMENS",
      "THE WARNING SIGNS",
      "THE WILD CARD",
      "THE FINAL PROPHECY"
    ][n-1])}
    ${body}
  </svg>`;

  const layers=[];
  if(art) layers.push({input:art,left:80,top:245});
  layers.push({input:Buffer.from(svg),left:0,top:0});

  // For the poster page, make the full-page SVG background
  // transparent so it cannot cover the authentic poster.
  const finalLayers = n===1
    ? [
        {input:art,left:80,top:245},
        {input:Buffer.from(svg.replace(
          `<rect width="${W}" height="${H}" fill="${PAPER}"/>`,
          `<rect width="${W}" height="${H}" fill="${PAPER}" fill-opacity="0"/>`
        )),left:0,top:0}
      ]
    : layers;

  await sharp({
    create:{width:W,height:H,channels:4,background:PAPER}
  }).composite(finalLayers)
    .jpeg({quality:94})
    .toFile(path.join(work,`page-${n}.jpg`));

  console.log(`Page ${n}/5 ready`);
}

// 01 — REAL POSTER / PREDICTION COVER
{
  const art = await sharp(poster)
    .resize(920,1040,{
      fit:"contain",
      background:PAPER
    })
    .png().toBuffer();

  await save(1,`
    <rect x="80" y="245" width="920" height="1040"
      fill="none" stroke="${INK}" stroke-width="2"/>
    <rect x="55" y="1295" width="970" height="465"
      fill="${PAPER}"/>
    ${txt("COMRADE KALYAN",55,1380,72)}
    ${txt("46%",55,1510,135,GOLD)}
    ${txt("FORECAST CONFIDENCE",380,1485,27,MUTED)}
    ${txt("CAUTIOUS · LEANING NEGATIVE",55,1590,38,RED)}
    ${txt("A revolutionary title.",55,1670,38)}
    ${txt("Will the screenplay deliver?",55,1730,38)}
  `,art);
}

// 02 — GOOD OMENS
await save(2,`
  ${txt("WHAT COULD WORK",55,355,82)}
  <rect x="55" y="390" width="970" height="8" fill="${GREEN}"/>
  ${txt("01 / SREE VISHNU",55,525,34,GREEN)}
  ${lines("His natural comic timing suits an ordinary man caught in extraordinary circumstances.",55,595,43,39,62,4)}
  <line x1="55" y1="850" x2="1025" y2="850" stroke="#b7aa98"/>
  ${txt("02 / THE COMEDY ENSEMBLE",55,940,34,GREEN)}
  ${lines("Satya and Brahmaji could turn misunderstandings into genuinely entertaining situations.",55,1010,43,39,62,4)}
  <line x1="55" y1="1270" x2="1025" y2="1270" stroke="#b7aa98"/>
  ${txt("03 / ROMANCE & MUSIC",55,1360,34,GREEN)}
  ${lines("Mahima Nambiar and Vijai Bulganin's music could provide the emotional balance.",55,1430,43,39,62,4)}
`);

// 03 — WARNING SIGNS
await save(3,`
  ${txt("HERE'S MY CONCERN.",55,365,75)}
  <rect x="55" y="405" width="970" height="9" fill="${RED}"/>
  ${txt("COMEDY CAN ENTERTAIN.",55,580,58)}
  ${txt("A WEAK SCREENPLAY",55,675,64,RED)}
  ${txt("CAN UNDO EVERYTHING.",55,770,58)}
  <line x1="55" y1="875" x2="1025" y2="875" stroke="${INK}" stroke-width="3"/>
  ${lines("Janakiram Marella must balance romance, political tension and humour without losing the central story.",55,1000,47,35,70,7)}
  <rect x="55" y="1510" width="970" height="145" fill="${RED}"/>
  ${txt("THE TITLE IS NOT THE STORY.",540,1600,41,PAPER,700,"middle")}
`);

// 04 — WILD CARD
await save(4,`
  ${txt("ONE STRONG",55,410,100)}
  ${txt("SECOND HALF.",55,525,100,GOLD)}
  <rect x="55" y="575" width="970" height="8" fill="${GOLD}"/>
  ${txt("COULD CHANGE",55,795,83)}
  ${txt("EVERYTHING.",55,905,100,GOLD)}
  ${lines("Sharper comedy. A convincing emotional turn. A climax that connects Kalyan's personal journey to the larger conflict.",55,1090,48,34,70,7)}
  ${txt("WILL IT SURPRISE US?",55,1650,52,RED)}
`);

// 05 — FINAL PROPHECY
await save(5,`
  ${txt("THE FATE FORECAST",55,370,79)}
  <rect x="55" y="415" width="970" height="8" fill="${GOLD}"/>
  ${txt("46%",540,735,235,GOLD,700,"middle")}
  ${txt("PREDICTION CONFIDENCE",540,815,34,MUTED,700,"middle")}
  ${txt("CAUTIOUS",540,1050,95,RED,700,"middle")}
  ${txt("LEANING NEGATIVE",540,1150,63,RED,700,"middle")}
  <line x1="55" y1="1240" x2="1025" y2="1240" stroke="${INK}" stroke-width="3"/>
  ${lines("The concept has promise. The screenplay must prove it.",80,1350,49,34,72,4)}
  ${txt("WILL COMRADE KALYAN",540,1640,40,INK,700,"middle")}
  ${txt("PROVE US WRONG?",540,1710,48,GOLD,700,"middle")}
`);

// Render 5 scenes: 5, 6, 7, 7, 5 seconds.
const durations=[5,6,7,7,5];
const clips=[];

for(let i=1;i<=5;i++){
  const clip=path.join(work,`clip-${i}.mp4`);
  const seconds=durations[i-1];
  execFileSync("ffmpeg",[
    "-y","-loop","1","-framerate","30",
    "-i",path.join(work,`page-${i}.jpg`),
    "-t",String(seconds),
    "-vf","format=yuv420p",
    "-c:v","libx264","-preset","medium","-crf","19",
    clip
  ],{stdio:"ignore"});
  clips.push(clip);
}

// Reliable 30-second concat.
const silent=path.join(work,"silent.mp4");
const filter=clips.map((_,i)=>
  `[${i}:v]setpts=PTS-STARTPTS[v${i}]`
).join(";")+";"+clips.map((_,i)=>`[v${i}]`).join("")
 +"concat=n=5:v=1:a=0[out]";

execFileSync("ffmpeg",[
  "-y",...clips.flatMap(f=>["-i",f]),
  "-filter_complex",filter,
  "-map","[out]","-c:v","libx264",
  "-preset","medium","-crf","19",
  "-pix_fmt","yuv420p",silent
],{stdio:"ignore"});

// Music with fade-in/out.
const finalMusic=path.join(root,"public/audio/comrade-kalyan-review-bed.mp3");
if(!fs.existsSync(finalMusic)) {
  throw new Error(`Music missing: ${finalMusic}`);
}

const output=path.join(dir,"reel.mp4");

execFileSync("ffmpeg",[
  "-y","-i",silent,
  "-stream_loop","-1","-i",finalMusic,
  "-filter_complex",
  "[1:a]atrim=0:30,asetpts=PTS-STARTPTS,volume=0.20,"+
  "afade=t=in:st=0:d=1,afade=t=out:st=27:d=3[a]",
  "-map","0:v:0","-map","[a]",
  "-c:v","copy","-c:a","aac","-b:a","192k",
  "-t","30","-movflags","+faststart",output
],{stdio:"ignore"});

console.log("DONE:",output);
