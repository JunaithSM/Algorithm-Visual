import { redirect } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (category === "Sorting") {
    redirect("/Sorting/BubbleSort");
  }
  redirect("/Searching/LinearSearch");
}
