"use client";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import Header from "@/components/Header";
import QuickAdd from "@/components/QuickAdd";
import FilterBar from "@/components/FilterBar";
import KanbanBoard from "@/components/KanbanBoard";
import ListView from "@/components/ListView";
import Modal from "@/components/Modal";
import CardForm from "@/components/CardForm";
import CardDetail from "@/components/CardDetail";

const POLL_INTERVAL = parseInt(process.env.NEXT_PUBLIC_POLL_INTERVAL || "5000", 10);

export default function Home() {
  const { viewMode, cards, init, refresh, addCard, updateCard } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editCardId, setEditCardId] = useState<string | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Initialize: load all cards from Google Sheets
  useEffect(() => {
    init().then(() => setReady(true));
  }, [init]);

  // Poll for updates every N seconds
  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => refresh(), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [ready, refresh]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface text-[#e2e8f0] font-mono">
        <div className="text-center">
          <div className="text-3xl mb-3 animate-pulse-slow">⚡</div>
          <div className="text-sm uppercase tracking-widest opacity-70">Connecting to Google Sheets...</div>
          <div className="text-xs text-[#475569] mt-2">Loading your shared content board</div>
        </div>
      </div>
    );
  }

  const expandedCard = cards.find(c => c.id === expandedCardId);
  const editCard = cards.find(c => c.id === editCardId);

  return (
    <main className="min-h-screen bg-surface">
      <Header onNewIdea={() => setShowAdd(true)} />
      <QuickAdd />
      <FilterBar />
      {viewMode === "kanban" ? (
        <KanbanBoard onCardClick={id => setExpandedCardId(id)} />
      ) : (
        <ListView onCardClick={id => setExpandedCardId(id)} />
      )}

      {(showAdd || editCardId) && (
        <Modal onClose={() => { setShowAdd(false); setEditCardId(null); }}>
          <CardForm card={editCard || null}
            onSubmit={async (data) => {
              if (editCardId) await updateCard(editCardId, data);
              else await addCard({ ...data, status: "idea" });
              setShowAdd(false);
              setEditCardId(null);
            }}
            onClose={() => { setShowAdd(false); setEditCardId(null); }} />
        </Modal>
      )}

      {expandedCard && (
        <Modal onClose={() => setExpandedCardId(null)}>
          <CardDetail card={expandedCard}
            onEdit={() => { setEditCardId(expandedCardId); setExpandedCardId(null); }}
            onClose={() => setExpandedCardId(null)} />
        </Modal>
      )}
    </main>
  );
}
