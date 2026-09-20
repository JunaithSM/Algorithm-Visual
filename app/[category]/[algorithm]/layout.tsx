import type { Metadata } from "next";
import {
  getAlgorithmById,
  SEARCHING_ALGORITHMS,
  SORTING_ALGORITHMS,
} from "@/lib/algorithms";

interface AlgorithmLayoutProps {
  children: React.ReactNode;
  params: Promise<{ category: string; algorithm: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; algorithm: string }>;
}): Promise<Metadata> {
  const { category, algorithm: algorithmId } = await params;
  const algo = getAlgorithmById(algorithmId);

  const title = `${algo.name} — ${category} Algorithm`;
  const description = `Learn ${algo.name} through interactive step-by-step visualization, animated canvas, and multi-language code editor. ${algo.description}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | DSA Visualizer`,
      description,
      url: `https://dsa.junaith.dev/${category}/${algorithmId}`,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${algo.name} Algorithm Visualization`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | DSA Visualizer`,
      description,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `https://dsa.junaith.dev/${category}/${algorithmId}`,
    },
  };
}

export async function generateStaticParams() {
  const params = [
    ...SEARCHING_ALGORITHMS.map((algo) => ({
      category: "Searching",
      algorithm: algo.id,
    })),
    ...SORTING_ALGORITHMS.map((algo) => ({
      category: "Sorting",
      algorithm: algo.id,
    })),
  ];
  return params;
}

export default async function AlgorithmLayout({
  children,
}: AlgorithmLayoutProps) {
  return <>{children}</>;
}
