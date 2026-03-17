"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { COLUMNS, AUTHORS } from "@/lib/types";

export default function Header({ onNewIdea }: { onNewIdea: () => void }) {
  const { commentAuthor, setCommentAuthor, viewMode, setViewMode, cards, syncStatus, lastSync, resetData } = useStore();
  const [reseeding, setReseeding] = useState(false);

  async function handleReseed() {
    if (!confirm("This will reset the original 50 ideas. Your new ideas will be kept. Continue?")) return;
    setReseeding(true);
    await resetData();
    setReseeding(false);
  }
  const stats = COLUMNS.reduce((a, col) => { a[col.id] = cards.filter(c => c.status === col.id).length; return a; }, {} as Record<string, number>);

  return (
    <div className="border-b border-surface-border-light px-6 py-4 flex items-center justify-between flex-wrap gap-3" style={{ background: "linear-gradient(180deg, #0f0f1a 0%, #0a0a0f 100%)" }}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚡</span>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight" style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Content Command Center</h1>
            <div className={`sync-dot ${syncStatus === "syncing" ? "syncing" : syncStatus === "error" ? "error" : "connected"}`} title={syncStatus === "idle" ? `Synced ${lastSync ? new Date(lastSync).toLocaleTimeString() : ""}` : syncStatus} />
            {syncStatus === "error" && <span className="text-[10px] text-[#f87171] font-semibold">Sync error</span>}
          </div>
          <p className="text-[11px] text-[#64748b] uppercase tracking-widest mt-0.5">Voltic · AdForge · AI Training — Live Sync via{" "}<a href={process.env.NEXT_PUBLIC_SPREADSHEET_URL} target="_blank" rel="noopener noreferrer" className="text-[#6366f1] hover:text-[#a78bfa] transition-colors">Google Sheets</a>{" · "}<a href={process.env.NEXT_PUBLIC_GDOC_URL} target="_blank" rel="noopener noreferrer" className="text-[#6366f1] hover:text-[#a78bfa] transition-colors">Content Doc</a></p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-1.5">{COLUMNS.map(col => <div key={col.id} className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ color: col.color, background: col.color + "15" }}>{col.label.split(" ")[0]} {stats[col.id]}</div>)}</div>
        <div className="flex gap-1 bg-surface-elevated rounded-lg p-1">
          {AUTHORS.map(n => <button key={n} className="btn px-3.5 py-1.5 rounded-md text-xs font-semibold" style={{ background: commentAuthor === n ? "#6366f1" : "transparent", color: commentAuthor === n ? "#fff" : "#94a3b8" }} onClick={() => setCommentAuthor(n)}>{n}</button>)}
        </div>
        <div className="flex gap-0.5 bg-surface-elevated rounded-lg p-0.5">
          {(["kanban", "list"] as const).map(m => <button key={m} className="btn px-2.5 py-1 rounded text-[11px]" style={{ background: viewMode === m ? "#2a2a4a" : "transparent", color: viewMode === m ? "#e2e8f0" : "#64748b" }} onClick={() => setViewMode(m)}>{m === "kanban" ? "Board" : "List"}</button>)}
        </div>
        <button className="btn px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: "#1e1e2e", color: "#64748b", border: "1px solid #2a2a4a" }} onClick={handleReseed} disabled={reseeding} title="Reset original 50 ideas (keeps your new ones)">{reseeding ? "Reseeding…" : "↺ Reseed"}</button>
        <button className="btn px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }} onClick={onNewIdea}>+ New</button>
      </div>
    </div>
  );
}
