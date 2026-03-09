"use client";
import { useStore } from "@/lib/store";
import { COLUMNS } from "@/lib/types";
import { ProductTag } from "./Tags";
export default function ListView({ onCardClick }: { onCardClick: (id: string) => void }) {
  const { getFilteredCards, toggleSelect, selectAll } = useStore();
  return (
    <div className="px-6 py-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
      {COLUMNS.map(col => {
        const cards = getFilteredCards(col.id); if (!cards.length) return null;
        return (
          <div key={col.id} className="mb-6">
            <div className="flex items-center gap-2 mb-2.5">
              {col.id === "idea" && cards.length > 0 && <input type="checkbox" className="checkbox-accent" checked={cards.every(c => c._selected)} onChange={() => selectAll(col.id)} />}
              <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
              <span className="text-sm font-bold" style={{ color: col.color }}>{col.label}</span>
              <span className="text-[11px] text-[#64748b]">({cards.length})</span>
            </div>
            {cards.map(card => (
              <div key={card.id} onClick={() => onCardClick(card.id)} className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg mb-1 cursor-pointer transition-colors" style={{ background: "#161625", border: "1px solid #2a2a4a" }} onMouseEnter={e => (e.currentTarget.style.background = "#1e1e3a")} onMouseLeave={e => (e.currentTarget.style.background = "#161625")}>
                {col.id === "idea" && <input type="checkbox" className="checkbox-accent" checked={!!card._selected} onClick={e => e.stopPropagation()} onChange={() => toggleSelect(card.id)} />}
                <div className="flex-1 text-[13px] font-semibold truncate">{card.title}</div>
                <div className="flex gap-1 flex-shrink-0">{card.products.map(p => <ProductTag key={p} product={p} />)}</div>
                <span className="text-[10px] text-[#64748b] w-12 text-right">{card.optimization}</span>
                <span className="text-[10px] opacity-50">{card.priority?.slice(0, 2)}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
