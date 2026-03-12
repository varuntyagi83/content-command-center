"use client";
import { useState } from "react";
import { ContentCard, PRODUCTS, PLATFORMS, PILLARS, FUNNEL_STAGES, PRIORITIES, OPTIMIZATION } from "@/lib/types";
interface Props { card?: ContentCard | null; onSubmit: (d: Partial<ContentCard>) => Promise<void>; onClose: () => void; }
export default function CardForm({ card, onSubmit, onClose }: Props) {
  const [f, sF] = useState({ title: card?.title || "", description: card?.description || "", products: card?.products || [] as string[], platforms: card?.platforms || [] as string[], pillar: card?.pillar || "", funnel: card?.funnel || "", priority: card?.priority || "🟡 Medium", optimization: card?.optimization || "" });
  const [submitting, setSubmitting] = useState(false);
  const tog = (k: "products" | "platforms", v: string) => sF(p => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x: string) => x !== v) : [...p[k], v] }));
  const sub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(f);
    } catch {} finally {
      setSubmitting(false);
    }
  };
  const I = "bg-[#0f0f1a] border border-surface-border rounded-lg px-3 py-2.5 text-[#e2e8f0] text-sm outline-none w-full focus:border-accent";
  const L = "text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-1.5 block";
  return (
    <div className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-border flex justify-between"><span className="text-[15px] font-bold">{card ? "Edit" : "New"} Idea</span><button className="btn text-[#64748b] text-lg p-1" onClick={onClose}>✕</button></div>
      <form onSubmit={sub} className="p-5 flex flex-col gap-4">
        <div><label className={L}>Title *</label><input value={f.title} onChange={e => sF({ ...f, title: e.target.value })} className={I} autoFocus /></div>
        <div><label className={L}>Description</label><textarea value={f.description} onChange={e => sF({ ...f, description: e.target.value })} rows={3} className={I + " resize-y"} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={L}>Product(s)</label><div className="flex flex-wrap gap-1">{PRODUCTS.map(p => <button type="button" key={p} className="btn px-2.5 py-1 rounded-md text-[11px] font-semibold" style={{ background: f.products.includes(p) ? "#6366f130" : "#0f0f1a", color: f.products.includes(p) ? "#a78bfa" : "#64748b", border: `1px solid ${f.products.includes(p) ? "#6366f150" : "#2a2a4a"}` }} onClick={() => tog("products", p)}>{p}</button>)}</div></div>
          <div><label className={L}>Platform(s)</label><div className="flex flex-wrap gap-1">{PLATFORMS.map(p => <button type="button" key={p} className="btn px-2.5 py-1 rounded-md text-[11px] font-semibold" style={{ background: f.platforms.includes(p) ? "#3b82f630" : "#0f0f1a", color: f.platforms.includes(p) ? "#60a5fa" : "#64748b", border: `1px solid ${f.platforms.includes(p) ? "#3b82f650" : "#2a2a4a"}` }} onClick={() => tog("platforms", p)}>{p}</button>)}</div></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={L}>Pillar</label><select value={f.pillar} onChange={e => sF({ ...f, pillar: e.target.value })} className={I + " cursor-pointer"}><option value="">Select...</option>{PILLARS.map(p => <option key={p}>{p}</option>)}</select></div>
          <div><label className={L}>Funnel</label><select value={f.funnel} onChange={e => sF({ ...f, funnel: e.target.value })} className={I + " cursor-pointer"}><option value="">Select...</option>{FUNNEL_STAGES.map(p => <option key={p}>{p}</option>)}</select></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={L}>Priority</label><select value={f.priority} onChange={e => sF({ ...f, priority: e.target.value })} className={I + " cursor-pointer"}>{PRIORITIES.map(p => <option key={p}>{p}</option>)}</select></div>
          <div><label className={L}>SEO/AEO</label><select value={f.optimization} onChange={e => sF({ ...f, optimization: e.target.value })} className={I + " cursor-pointer"}><option value="">Select...</option>{OPTIMIZATION.map(o => <option key={o}>{o}</option>)}</select></div>
        </div>
        <div className="flex gap-2 justify-end"><button type="button" className="btn bg-surface-elevated text-[#94a3b8] px-5 py-2.5 rounded-lg text-sm" onClick={onClose}>Cancel</button><button type="submit" className={"btn text-white px-6 py-2.5 rounded-lg text-sm font-semibold" + (submitting ? " opacity-50 cursor-not-allowed" : "")} style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }} disabled={submitting}>{card ? "Save" : "Add"}</button></div>
      </form>
    </div>
  );
}
