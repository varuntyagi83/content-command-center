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

export default function Home() {
  const { viewMode, cards, addCard, updateCard } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editCardId, setEditCardId] = useState<number | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch with zustand persist
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface text-[#e2e8f0] font-mono">
        <div className="text-center">
          <div className="text-3xl mb-3 animate-pulse-slow">⚡</div>
          <div className="text-sm uppercase tracking-widest opacity-70">Loading Command Center...</div>
        </div>
      </div>
    );
  }

  const expandedCard = cards.find((c) => c.id === expandedCardId);
  const editCard = cards.find((c) => c.id === editCardId);

  return (
    <main className="min-h-screen bg-surface">
      <Header onNewIdea={() => setShowAdd(true)} />
      <QuickAdd />
      <FilterBar />

      {viewMode === "kanban" ? (
        <KanbanBoard onCardClick={(id) => setExpandedCardId(id)} />
      ) : (
        <ListView onCardClick={(id) => setExpandedCardId(id)} />
      )}

      {/* Add / Edit modal */}
      {(showAdd || editCardId) && (
        <Modal onClose={() => { setShowAdd(false); setEditCardId(null); }}>
          <CardForm
            card={editCard || null}
            onSubmit={(data) => {
              if (editCardId) updateCard(editCardId, data);
              else addCard(data as any);
              setShowAdd(false);
              setEditCardId(null);
            }}
            onClose={() => { setShowAdd(false); setEditCardId(null); }}
          />
        </Modal>
      )}

      {/* Card detail modal */}
      {expandedCard && (
        <Modal onClose={() => setExpandedCardId(null)}>
          <CardDetail
            card={expandedCard}
            onEdit={() => { setEditCardId(expandedCardId); setExpandedCardId(null); }}
            onClose={() => setExpandedCardId(null)}
          />
        </Modal>
      )}
    </main>
  );
}
