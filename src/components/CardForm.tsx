"use client";

import { useState } from "react";
import { ContentCard, PRODUCTS, PLATFORMS, PILLARS, FUNNEL_STAGES, PRIORITIES, OPTIMIZATION } from "@/lib/types";

interface Props {
  card?: ContentCard | null;
  onSubmit: (data: Partial<ContentCard>) => void;
  onClose: () => void;
}

export default function CardForm({ card, onSubmit, onClose }: Props) {
  const [form, setForm] = useState({
    title: card?.title || "",
    description: card?.description || "",
    products: card?.products || [],
    platforms: card?.platforms || [],
    pillar: card?.pillar || "",
    funnel: card?.funnel || "",
    priority: card?.priority || "🟡 Medium",
    optimization: card?.optimization || "",
  });

  const toggleArr = (key: "products" | "platforms", val: string) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter((v) => v !== val) : [...f[key], val],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form);
  };

  const inputCls = "bg-[#0f0f1a] border border-surface-border rounded-lg px-3 py-2.5 text-[#e2e8f0] text-sm outline-none w-full focus:border-accent";
  const labelCls = "text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-1.5 block";

  return (
    <div className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-border flex justify-between items-center">
        <span className="text-[15px] font-bold">{card ? "Edit" : "New"} Idea</span>
        <button className="btn text-[#64748b] text-lg p-1" onClick={onClose}>✕</button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
        <div>
          <label className={labelCls}>Title *</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputCls} autoFocus />
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3} className={inputCls + " resize-y"} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Product(s)</label>
            <div className="flex flex-wrap gap-1">
              {PRODUCTS.map((p) => (
                <button type="button" key={p} className="btn px-2.5 py-1 rounded-md text-[11px] font-semibold"
                  style={{
                    background: form.products.includes(p) ? "#6366f130" : "#0f0f1a",
                    color: form.products.includes(p) ? "#a78bfa" : "#64748b",
                    border: `1px solid ${form.products.includes(p) ? "#6366f150" : "#2a2a4a"}`,
                  }}
                  onClick={() => toggleArr("products", p)}>{p}</button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>Platform(s)</label>
            <div className="flex flex-wrap gap-1">
              {PLATFORMS.map((p) => (
                <button type="button" key={p} className="btn px-2.5 py-1 rounded-md text-[11px] font-semibold"
                  style={{
                    background: form.platforms.includes(p) ? "#3b82f630" : "#0f0f1a",
                    color: form.platforms.includes(p) ? "#60a5fa" : "#64748b",
                    border: `1px solid ${form.platforms.includes(p) ? "#3b82f650" : "#2a2a4a"}`,
                  }}
                  onClick={() => toggleArr("platforms", p)}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Content Pillar</label>
            <select value={form.pillar} onChange={(e) => setForm({ ...form, pillar: e.target.value })} className={inputCls + " cursor-pointer"}>
              <option value="">Select...</option>
              {PILLARS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Funnel Stage</label>
            <select value={form.funnel} onChange={(e) => setForm({ ...form, funnel: e.target.value })} className={inputCls + " cursor-pointer"}>
              <option value="">Select...</option>
              {FUNNEL_STAGES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Priority</label>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className={inputCls + " cursor-pointer"}>
              {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>SEO / AEO</label>
            <select value={form.optimization} onChange={(e) => setForm({ ...form, optimization: e.target.value })} className={inputCls + " cursor-pointer"}>
              <option value="">Select...</option>
              {OPTIMIZATION.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-1">
          <button type="button" className="btn bg-surface-elevated text-[#94a3b8] px-5 py-2.5 rounded-lg text-sm" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn text-white px-6 py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}>
            {card ? "Save" : "Add Idea"}
          </button>
        </div>
      </form>
    </div>
  );
}
