import type { MetadataRoute } from "next";
import {
  SEARCHING_ALGORITHMS,
  SORTING_ALGORITHMS,
} from "@/lib/algorithms";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dsa.junaith.dev";
  const lastModified = new Date();

  const searchingRoutes: MetadataRoute.Sitemap = SEARCHING_ALGORITHMS.map(
    (algo) => ({
      url: `${baseUrl}/Searching/${algo.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  const sortingRoutes: MetadataRoute.Sitemap = SORTING_ALGORITHMS.map(
    (algo) => ({
      url: `${baseUrl}/Sorting/${algo.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...searchingRoutes,
    ...sortingRoutes,
  ];
}
