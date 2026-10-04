import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.moviehmm.com"),

  title: {
    default: "MovieHmm — Independent Movie Reviews",
    template: "%s | MovieHmm",
  },

  description:
    "Independent movie reviews with honest ratings, original opinions and scores that are earned, not inherited from hype.",

  applicationName: "MovieHmm",

  authors: [
    {
      name: "MovieHmm",
      url: "https://www.moviehmm.com",
    },
  ],

  creator: "MovieHmm",
  publisher: "MovieHmm",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    siteName: "MovieHmm",
    url: "https://www.moviehmm.com",
    title: "MovieHmm — Independent Movie Reviews",
    description:
      "No hype. No hate. Just the movie.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
