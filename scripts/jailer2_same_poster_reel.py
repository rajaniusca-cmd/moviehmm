from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import subprocess

ROOT = Path.home() / "Desktop/moviehmm"
DL = Path.home() / "Downloads"
WORK = ROOT / ".reel-work/jailer2-same-poster"
OUT = ROOT / "public/reels/jailer-2"

WORK.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)

W, H, FPS = 810, 1440, 30
PAPER = (238, 229, 211)
INK = (30, 25, 23)
RED = (151, 43, 38)
GOLD = (166, 107, 43)

POSTER = DL / "new.png"
MUSIC = ROOT / "public/reels/jailer-2/hukum-theme.mp3"

if not POSTER.exists():
    raise SystemExit(f"Missing approved poster: {POSTER}")
if not MUSIC.exists():
    raise SystemExit(f"Missing Hukum music: {MUSIC}")

FONTS = Path("/System/Library/Fonts/Supplemental")

def font(size):
    return ImageFont.truetype(
        str(FONTS / "Georgia Bold.ttf"), size
    )

def center(draw, text, y, size, color):
    f = font(size)
    while draw.textbbox((0, 0), text, font=f)[2] > 750:
        size -= 2
        f = font(size)
    b = draw.textbbox((0, 0), text, font=f)
    draw.text(
        ((W - (b[2]-b[0]))//2, y),
        text, font=f, fill=color
    )

slides = [
    ("WORLDWIDE COLLECTION", "Rs 628.05 CRORE"),
    ("INDIA GROSS", "Rs 408.55 CRORE"),
    ("INDIA NET", "Rs 348.85 CRORE"),
    ("OVERSEAS COLLECTION", "Rs 219.50 CRORE"),
    ("DAY 9 INDIA NET", "Rs 14.50 CRORE"),
]

# Poster remains identical across all five slides.
original = Image.open(POSTER).convert("RGB")
poster = original.resize((W, 1120), Image.Resampling.LANCZOS)

clips = []

for i, (headline, amount) in enumerate(slides):
    page = Image.new("RGB", (W, H), PAPER)
    page.paste(poster, (0, 0))
    d = ImageDraw.Draw(page)

    # Only the lower collection section changes.
    d.rectangle((0, 1120, W, H), fill=PAPER)
    d.line((35, 1135, 775, 1135), fill=INK, width=4)

    center(d, headline, 1170, 37, INK)
    center(d, amount, 1250, 58, RED)
    center(d, "MOVIE....HMM | BOX OFFICE", 1365, 19, GOLD)

    image = WORK / f"slide-{i}.png"
    page.save(image)

    clip = WORK / f"clip-{i}.mp4"

    subprocess.run([
        "ffmpeg", "-y", "-loglevel", "error",
        "-loop", "1", "-framerate", str(FPS),
        "-i", str(image),
        "-t", "4",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "19",
        "-pix_fmt", "yuv420p",
        str(clip)
    ], check=True)

    clips.append(clip)

concat = WORK / "concat.txt"
concat.write_text(
    "".join(f"file '{p}'\n" for p in clips)
)

silent = WORK / "silent.mp4"
subprocess.run([
    "ffmpeg", "-y", "-loglevel", "error",
    "-f", "concat", "-safe", "0",
    "-i", str(concat),
    "-c", "copy", str(silent)
], check=True)

output = OUT / "jailer2-same-poster-hukum-20s.mp4"

subprocess.run([
    "ffmpeg", "-y", "-loglevel", "error",
    "-i", str(silent),
    "-i", str(MUSIC),
    "-map", "0:v:0",
    "-map", "1:a:0",
    "-t", "20",
    "-c:v", "copy",
    "-c:a", "aac",
    "-b:a", "192k",
    "-af", "afade=t=out:st=18:d=2",
    "-movflags", "+faststart",
    str(output)
], check=True)

print("FINAL REEL:", output)
