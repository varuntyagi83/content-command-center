"use client";

import { useStore } from "@/lib/store";
import { COLUMNS, AUTHORS } from "@/lib/types";

export default function Header({ onNewIdea }: { onNewIdea: () => void }) {
  const { commentAuthor, setCommentAuthor, viewMode, setViewMode, cards, resetData } = useStore();

  const stats = COLUMNS.reduce((acc, col) => {
    acc[col.id] = cards.filter((c) => c.status === col.id).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="border-b border-surface-border-light px-6 py-4 flex items-center justify-between flex-wrap gap-3"
      style={{ background: "linear-gradient(180deg, #0f0f1a 0%, #0a0a0f 100%)" }}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚡</span>
        <div>
          <h1 className="text-lg font-bold tracking-tight"
            style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Content Command Center
          </h1>
          <p className="text-[11px] text-[#64748b] uppercase tracking-widest mt-0.5">
            Voltic · AdForge · AI Catalyst
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Stats */}
        <div className="flex gap-1.5">
          {COLUMNS.map((col) => (
            <div key={col.id} className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
              style={{ color: col.color, background: col.color + "15" }}>
              {col.label.split(" ")[0]} {stats[col.id]}
            </div>
          ))}
        </div>

        {/* Author toggle */}
        <div className="flex gap-1 bg-surface-elevated rounded-lg p-1">
          {AUTHORS.map((name) => (
            <button key={name} className="btn px-3.5 py-1.5 rounded-md text-xs font-semibold"
              style={{
                background: commentAuthor === name ? "#6366f1" : "transparent",
                color: commentAuthor === name ? "#fff" : "#94a3b8",
              }}
              onClick={() => setCommentAuthor(name)}>
              {name}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-0.5 bg-surface-elevated rounded-lg p-0.5">
          {(["kanban", "list"] as const).map((m) => (
            <button key={m} className="btn px-2.5 py-1 rounded text-[11px]"
              style={{
                background: viewMode === m ? "#2a2a4a" : "transparent",
                color: viewMode === m ? "#e2e8f0" : "#64748b",
              }}
              onClick={() => setViewMode(m)}>
              {m === "kanban" ? "Board" : "List"}
            </button>
          ))}
        </div>

        <button className="btn px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
          onClick={onNewIdea}>
          + New
        </button>

        <button className="btn px-3 py-2 rounded-lg text-xs bg-surface-elevated text-[#64748b]"
          onClick={() => { if (confirm("Reset to original 50 ideas?")) resetData(); }}
          title="Reset">
          ↺
        </button>
      </div>
    </div>
  );
}
