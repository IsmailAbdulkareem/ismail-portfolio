import "server-only";
import { revalidatePath } from "next/cache";

// Machine-readable routes built from Supabase content; refresh them whenever
// projects, services or skills change so crawlers and LLMs see edits at once.
export function revalidateFeeds() {
  revalidatePath("/sitemap.xml");
  revalidatePath("/llms.txt");
  revalidatePath("/llms-full.txt");
}
