"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { COLUMNS, ContentCard } from "@/lib/types";
import { ProductTag, PlatformTag } from "./Tags";

interface Props {
  card: ContentCard;
  onEdit: () => void;
  onClose: () => void;
}

export default function CardDetail({ card, onEdit, onClose }: Props) {
  const { deleteCard, moveCard, addComment, commentAuthor } = useStore();
  const [newComment, setNewComment] = useState("");
  const col = COLUMNS.find((c) => c.id === card.status);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addComment(card.id, newComment.trim());
    setNewComment("");
  };

  const handleDelete = () => {
    if (confirm("Delete this idea?")) {
      deleteCard(card.id);
      onClose();
    }
  };

  return (
    <div className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden flex flex-col"
      style={{ maxHeight: "85vh" }}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-surface-border flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: col?.color }} />
          <span className="text-[11px] text-[#94a3b8] font-semibold uppercase tracking-wider">{col?.label}</span>
        </div>
        <div className="flex gap-1">
          <button className="btn bg-surface-elevated text-accent-light px-3 py-1.5 rounded-md text-[11px] font-semibold" onClick={onEdit}>Edit</button>
          <button className="btn bg-surface-elevated text-[#f87171] px-3 py-1.5 rounded-md text-[11px] font-semibold" onClick={handleDelete}>Delete</button>
          <button className="btn text-[#64748b] text-lg px-1.5" onClick={onClose}>✕</button>
        </div>
      </div>

      {/* Body */}
      <div className="overflow-y-auto flex-1 p-5">
        <h2 className="text-xl font-bold mb-2 leading-snug">{card.title}</h2>
        {card.description && (
          <p className="text-sm text-[#94a3b8] leading-relaxed mb-4">{card.description}</p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {card.products.map((p) => <ProductTag key={p} product={p} />)}
          {card.platforms.map((p) => <PlatformTag key={p} platform={p} />)}
          {card.pillar && <span className="tag" style={{ background: "#7c3aed20", color: "#c4b5fd" }}>{card.pillar}</span>}
          {card.funnel && <span className="tag" style={{ background: "#0ea5e920", color: "#67e8f9" }}>{card.funnel}</span>}
          {card.optimization && <span className="tag" style={{ background: "#f9731620", color: "#fdba74" }}>{card.optimization}</span>}
        </div>

        {/* Move buttons */}
        <div className="mb-5">
          <div className="text-[11px] text-[#64748b] font-semibold uppercase tracking-wider mb-2">Move to</div>
          <div className="flex flex-wrap gap-1">
            {COLUMNS.filter((c) => c.id !== card.status).map((c) => (
              <button key={c.id} className="btn px-3 py-1.5 rounded-md text-[11px] font-semibold"
                style={{ background: c.color + "15", color: c.color, border: `1px solid ${c.color}30` }}
                onClick={() => moveCard(card.id, c.id)}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="border-t border-surface-border pt-4">
          <div className="text-[11px] text-[#64748b] font-semibold uppercase tracking-wider mb-3">
            Discussion ({card.comments.length})
          </div>

          <div className="flex flex-col gap-2.5 mb-3">
            {card.comments.map((c, i) => (
              <div key={i} className="bg-[#0f0f1a] rounded-xl p-3 border border-surface-border-light">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold"
                    style={{ color: c.author === "Varun" ? "#a78bfa" : "#f472b6" }}>
                    {c.author}
                  </span>
                  <span className="text-[10px] text-[#475569]">
                    {new Date(c.time).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-[#cbd5e1] leading-relaxed">{c.text}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              placeholder={`Comment as ${commentAuthor}...`}
              className="flex-1 bg-[#0f0f1a] border border-surface-border rounded-lg px-3 py-2.5 text-[#e2e8f0] text-sm outline-none"
            />
            <button className="btn bg-accent text-white px-4 py-2.5 rounded-lg text-xs font-semibold"
              onClick={handleAddComment}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
