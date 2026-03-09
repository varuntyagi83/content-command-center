"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { COLUMNS, ContentCard, ColumnId } from "@/lib/types";
import { ProductTag, PlatformTag } from "./Tags";
export default function KanbanBoard({ onCardClick }: { onCardClick: (id: string) => void }) {
  const { getFilteredCards, moveCard, toggleSelect, selectAll } = useStore();
  const [dragCard, setDragCard] = useState<ContentCard | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  return (
    <div className="flex gap-3 px-5 py-4 overflow-x-auto" style={{ minHeight: "calc(100vh - 200px)" }}>
      {COLUMNS.map(col => {
        const cards = getFilteredCards(col.id);
        const isIdea = col.id === "idea";
        return (
          <div key={col.id} onDragOver={e => { e.preventDefault(); setDragOver(col.id); }} onDragLeave={() => setDragOver(null)} onDrop={e => { e.preventDefault(); if (dragCard) moveCard(dragCard.id, col.id); setDragCard(null); setDragOver(null); }}
            className="flex flex-col rounded-xl" style={{ flex: "1 0 240px", maxWidth: 320, minWidth: 240, background: dragOver === col.id ? "#1a1a2e" : "#0f0f1a", border: `1px solid ${dragOver === col.id ? col.color + "80" : "#1e1e3a"}` }}>
            <div className="px-3.5 pt-3.5 pb-2.5 border-b border-surface-border-light flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isIdea && cards.length > 0 && <input type="checkbox" className="checkbox-accent" checked={cards.every(c => c._selected)} onChange={() => selectAll(col.id)} />}
                <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                <span className="text-sm font-semibold">{col.label}</span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ color: col.color, background: col.color + "20" }}>{cards.length}</span>
            </div>
            <div className="p-2 flex-1 overflow-y-auto flex flex-col gap-2">
              {cards.map(card => (
                <div key={card.id} className="card-hover animate-slide-up rounded-xl p-3 cursor-pointer" draggable onDragStart={e => { setDragCard(card); e.dataTransfer.effectAllowed = "move"; }}
                  style={{ background: card._selected ? "#1e1e3a" : "#161625", border: `1px solid ${card._selected ? "#6366f1" : "#2a2a4a"}`, opacity: dragCard?.id === card.id ? 0.4 : 1 }}>
                  <div className="flex gap-2 items-start">
                    {isIdea && <input type="checkbox" className="checkbox-accent mt-0.5 flex-shrink-0" checked={!!card._selected} onChange={e => { e.stopPropagation(); toggleSelect(card.id); }} />}
                    <div className="flex-1 min-w-0" onClick={() => onCardClick(card.id)}>
                      <div className="flex justify-between mb-1.5">
                        <div className="text-[13px] font-semibold leading-snug flex-1 pr-2">{card.title}</div>
                        <span className="text-[10px] opacity-50 flex-shrink-0">{card.priority?.slice(0, 2)}</span>
                      </div>
                      {card.description && <div className="text-[11px] text-[#94a3b8] leading-relaxed mb-2 line-clamp-2">{card.description}</div>}
                      <div className="flex flex-wrap gap-0.5 mb-1">{card.products.map(p => <ProductTag key={p} product={p} />)}</div>
                      <div className="flex flex-wrap gap-0.5">{card.platforms.map(p => <PlatformTag key={p} platform={p} />)}</div>
                      {card.comments.length > 0 && <div className="mt-2 text-[10px] text-[#64748b]">💬 {card.comments.length}</div>}
                    </div>
                  </div>
                </div>
              ))}
              {cards.length === 0 && <div className="text-center py-6 text-[#334155] text-xs italic">Drag cards here</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
