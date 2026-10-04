import Link from "next/link";
import { getAllReviews } from "@/lib/reviews";
import ReviewShelf from "@/components/ReviewShelf";

export default function ReviewsPage() {
  const reviews = getAllReviews();

  return (
    <>
      <header className="dhHeader shell">

        <Link href="/" className="dhBrand">
          Movie....🤔<em>hmm</em>

          <small>
            WE WATCH. WE THINK. WE WRITE.
          </small>
        </Link>

        <nav>
          <Link href="/">Home</Link>
          <Link href="/#spotlight">Spotlight</Link>
          <Link href="/#trending">Trending</Link>
        </nav>

      </header>

      <main className="reviewArchive shell">

        <header className="archiveHero">

          <small>
            THE Movie....🤔hmm ARCHIVE
          </small>

          <h1>
            The Review
            <em>Shelf.</em>
          </h1>

          <div>

            <p>
              Every movie I've watched, thought about,
              argued with myself over, and finally rated.
              Pick a title or search the shelf.
            </p>

            <strong>
              {reviews.length}
              <span> REVIEWS AND COUNTING</span>
            </strong>

          </div>

        </header>

        <ReviewShelf reviews={reviews} />

        <footer className="archiveEnding">

          <span>AND THAT'S THE REEL.</span>

          <h2>
            More movies.<br/>
            More arguments.<br/>
            <em>More hmm...</em>
          </h2>

          <p>
            The shelf keeps growing. 🤔
          </p>

        </footer>

      </main>
    </>
  );
}
