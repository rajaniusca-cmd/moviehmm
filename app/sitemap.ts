import type { MetadataRoute } from "next";
import { getAllReviews } from "@/lib/reviews";

const SITE = "https://www.moviehmm.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/about",
    "/editorial-policy",
    "/disclaimer",
    "/privacy",
    "/terms",
    "/copyright",
    "/contact",
  ];

  return [
    ...pages.map((path, index) => ({
      url: `${SITE}${path}`,
      lastModified: new Date(),
      changeFrequency: index === 0 ? "daily" as const : "monthly" as const,
      priority: index === 0 ? 1 : 0.5,
    })),

    ...getAllReviews().map((r) => ({
      url: `${SITE}/reviews/${r.slug}`,
      lastModified: new Date(r.publishedDate),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
