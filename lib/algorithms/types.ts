export type AlgorithmCategory = "Searching" | "Sorting";

export interface Algorithm {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
  code: Record<string, string>;
}
