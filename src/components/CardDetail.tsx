"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { COLUMNS, ContentCard } from "@/lib/types";
import { ProductTag, PlatformTag } from "./Tags";
interface Props { card: ContentCard; onEdit: () => void; onClose: () => void; }
export default function CardDetail({ card, onEdit, onClose }: Props) {
  const { deleteCard, moveCard, addComment, deleteComment, commentAuthor } = useStore();
  const [nc, setNc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const col = COLUMNS.find(c => c.id === card.status);
  const handleComment = async () => { if (!nc.trim()) return; setSubmitting(true); await addComment(card.id, nc.trim()); setNc(""); setSubmitting(false); };
  const handleDelete = async () => { if (confirm("Delete?")) { await deleteCard(card.id); onClose(); } };
  return (
    <div className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden flex flex-col" style={{ maxHeight: "85vh" }}>
      <div className="px-5 py-4 border-b border-surface-border flex justify-between flex-shrink-0">
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: col?.color }} /><span className="text-[11px] text-[#94a3b8] font-semibold uppercase tracking-wider">{col?.label}</span></div>
        <div className="flex gap-1"><button className="btn bg-surface-elevated text-accent-light px-3 py-1.5 rounded-md text-[11px] font-semibold" onClick={onEdit}>Edit</button><button className="btn bg-surface-elevated text-[#f87171] px-3 py-1.5 rounded-md text-[11px] font-semibold" onClick={handleDelete}>Delete</button><button className="btn text-[#64748b] text-lg px-1.5" onClick={onClose}>✕</button></div>
      </div>
      <div className="overflow-y-auto flex-1 p-5">
        <h2 className="text-xl font-bold mb-2 leading-snug">{card.title}</h2>
        {card.description && <p className="text-sm text-[#94a3b8] leading-relaxed mb-4">{card.description}</p>}
        <div className="flex flex-col gap-1 mb-4">
          {card.products.length > 0 && <div className="flex flex-wrap gap-1">{card.products.map(p => <ProductTag key={p} product={p} />)}</div>}
          {card.platforms.length > 0 && <div className="flex flex-wrap gap-1">{card.platforms.map(p => <PlatformTag key={p} platform={p} />)}</div>}
          {card.pillar && <div className="flex flex-wrap gap-1"><span className="tag" style={{ background: "#7c3aed20", color: "#c4b5fd" }}>{card.pillar}</span></div>}
          {card.funnel && <div className="flex flex-wrap gap-1"><span className="tag" style={{ background: "#0ea5e920", color: "#67e8f9" }}>{card.funnel}</span></div>}
          {card.optimization && <div className="flex flex-wrap gap-1"><span className="tag" style={{ background: "#f9731620", color: "#fdba74" }}>{card.optimization}</span></div>}
        </div>
        <div className="mb-5">
          <div className="text-[11px] text-[#64748b] font-semibold uppercase tracking-wider mb-2">Move to</div>
          <div className="flex flex-wrap gap-1">{COLUMNS.filter(c => c.id !== card.status).map(c => <button key={c.id} className="btn px-3 py-1.5 rounded-md text-[11px] font-semibold" style={{ background: c.color + "15", color: c.color, border: `1px solid ${c.color}30` }} onClick={() => moveCard(card.id, c.id)}>{c.label}</button>)}</div>
        </div>
        <div className="border-t border-surface-border pt-4">
          <div className="text-[11px] text-[#64748b] font-semibold uppercase tracking-wider mb-3">Discussion ({card.comments.length})</div>
          <div className="flex flex-col gap-2.5 mb-3">
            {card.comments.map((c, i) => (
              <div key={c.id || i} className="bg-[#0f0f1a] rounded-xl p-3 border border-surface-border-light">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold" style={{ color: c.author === "Varun" ? "#a78bfa" : "#f472b6" }}>{c.author}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#475569]">{new Date(c.time).toLocaleDateString()}</span>
                    <button className="text-[10px] text-[#475569] hover:text-[#f87171] transition-colors" onClick={() => deleteComment(c.id)} title="Delete comment">✕</button>
                  </div>
                </div>
                <div className="text-sm text-[#cbd5e1] leading-relaxed">{c.text}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={nc} onChange={e => setNc(e.target.value)} onKeyDown={e => e.key === "Enter" && handleComment()} placeholder={`Comment as ${commentAuthor}...`} className="flex-1 bg-[#0f0f1a] border border-surface-border rounded-lg px-3 py-2.5 text-[#e2e8f0] text-sm outline-none" disabled={submitting} />
            <button className={`btn bg-accent text-white px-4 py-2.5 rounded-lg text-xs font-semibold${submitting ? " opacity-50 cursor-not-allowed" : ""}`} onClick={handleComment} disabled={submitting}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
