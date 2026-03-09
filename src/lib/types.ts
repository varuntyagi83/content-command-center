export interface ContentCard {
  id: string;
  title: string;
  description: string;
  products: string[];
  platforms: string[];
  pillar: string;
  funnel: string;
  priority: string;
  optimization: string;
  status: ColumnId;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  _selected?: boolean;
}

export interface Comment {
  id: string;
  cardId: string;
  author: string;
  text: string;
  time: string;
}

export type ColumnId = "idea" | "drafting" | "review" | "scheduled" | "published";

export interface Column { id: ColumnId; label: string; color: string; }
export interface Filters { product: string; platform: string; pillar: string; search: string; }

export const PRODUCTS = ["Voltic", "AdForge", "AI Catalyst"];
export const PLATFORMS = ["LinkedIn", "Twitter/X", "Medium", "Product Hunt", "Indie Hackers"];
export const PILLARS = ["Building in Public", "Product Tutorials", "Thought Leadership", "Case Studies", "Hot Takes", "Behind the Scenes"];
export const FUNNEL_STAGES = ["Awareness", "Trust", "Conversion"];
export const OPTIMIZATION = ["SEO", "AEO", "Both"];
export const PRIORITIES = ["🔴 High", "🟡 Medium", "🟢 Low"];
export const AUTHORS = ["Varun", "Renuka"];

export const COLUMNS: Column[] = [
  { id: "idea", label: "💡 Ideas", color: "#6366f1" },
  { id: "drafting", label: "✍️ Drafting", color: "#f59e0b" },
  { id: "review", label: "👀 Review", color: "#3b82f6" },
  { id: "scheduled", label: "📅 Scheduled", color: "#8b5cf6" },
  { id: "published", label: "🚀 Published", color: "#10b981" },
];

export function getProductColor(p: string) {
  if (p === "Voltic") return { bg: "#6366f120", text: "#818cf8" };
  if (p === "AdForge") return { bg: "#f59e0b20", text: "#fbbf24" };
  if (p === "AI Catalyst") return { bg: "#10b98120", text: "#34d399" };
  return { bg: "#1e293b", text: "#94a3b8" };
}
