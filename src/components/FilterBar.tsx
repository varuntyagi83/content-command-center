"use client";
import { useStore } from "@/lib/store";
import { PRODUCTS, PLATFORMS, PILLARS } from "@/lib/types";
export default function FilterBar() {
  const { filters, setFilters, cards, getFilteredCards, bulkKeep, bulkReject } = useStore();
  const ideaCards = getFilteredCards("idea");
  const sel = ideaCards.filter(c => c._selected).length;
  const has = filters.product || filters.platform || filters.pillar || filters.search;
  const sc = "bg-surface-elevated text-[#e2e8f0] border border-surface-border px-2.5 py-1.5 rounded-md text-xs outline-none focus:border-accent";
  return (
    <div className="px-6 py-2.5 border-b border-surface-border-light flex gap-2 items-center flex-wrap">
      <span className="text-[11px] text-[#64748b] font-semibold uppercase tracking-wider mr-1">Filter:</span>
      <input value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} placeholder="Search..." className="bg-surface-elevated text-[#e2e8f0] border border-surface-border px-2.5 py-1.5 rounded-md text-xs outline-none w-36 focus:border-accent" />
      <select value={filters.product} onChange={e => setFilters({ ...filters, product: e.target.value })} className={sc}><option value="">All Products</option>{PRODUCTS.map(p => <option key={p}>{p}</option>)}</select>
      <select value={filters.platform} onChange={e => setFilters({ ...filters, platform: e.target.value })} className={sc}><option value="">All Platforms</option>{PLATFORMS.map(p => <option key={p}>{p}</option>)}</select>
      <select value={filters.pillar} onChange={e => setFilters({ ...filters, pillar: e.target.value })} className={sc}><option value="">All Pillars</option>{PILLARS.map(p => <option key={p}>{p}</option>)}</select>
      {has && <button className="btn text-[#f87171] text-[11px] font-semibold px-2 py-1" onClick={() => setFilters({ product: "", platform: "", pillar: "", search: "" })}>Clear ✕</button>}
      {sel > 0 ? (
        <div className="ml-auto flex gap-1.5 items-center">
          <span className="text-xs text-accent-light font-semibold">{sel} selected</span>
          <button className="btn text-[11px] font-semibold px-3.5 py-1.5 rounded-md" style={{ background: "#10b98130", color: "#34d399" }} onClick={() => { if (confirm(`Keep ${sel} ideas and move to Drafting?`)) bulkKeep(); }}>✓ Keep → Drafting</button>
          <button className="btn text-[11px] font-semibold px-3.5 py-1.5 rounded-md" style={{ background: "#ef444430", color: "#f87171" }} onClick={() => { if (confirm(`Reject ${sel} idea(s)?`)) bulkReject(); }}>✕ Reject</button>
        </div>
      ) : <span className="ml-auto text-[11px] text-[#475569]">{cards.length} total</span>}
    </div>
  );
}
