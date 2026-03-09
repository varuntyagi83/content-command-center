import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ContentCard, ColumnId, Filters } from "./types";
import { SEED_IDEAS } from "./seed-data";

interface AppState {
  cards: ContentCard[];
  nextId: number;
  commentAuthor: string;
  viewMode: "kanban" | "list";
  filters: Filters;

  // Actions
  setCommentAuthor: (author: string) => void;
  setViewMode: (mode: "kanban" | "list") => void;
  setFilters: (filters: Filters) => void;
  addCard: (card: Omit<ContentCard, "id" | "status" | "comments" | "createdAt">) => void;
  updateCard: (id: number, updates: Partial<ContentCard>) => void;
  deleteCard: (id: number) => void;
  moveCard: (id: number, status: ColumnId) => void;
  addComment: (cardId: number, text: string) => void;
  toggleSelect: (id: number) => void;
  selectAll: (status: ColumnId, cards: ContentCard[]) => void;
  bulkKeep: (ids: number[]) => void;
  bulkReject: (ids: number[]) => void;
  resetData: () => void;
  getFilteredCards: (status: ColumnId) => ContentCard[];
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      cards: [...SEED_IDEAS],
      nextId: 51,
      commentAuthor: "Varun",
      viewMode: "kanban",
      filters: { product: "", platform: "", pillar: "", search: "" },

      setCommentAuthor: (author) => set({ commentAuthor: author }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setFilters: (filters) => set({ filters }),

      addCard: (card) =>
        set((state) => ({
          cards: [
            ...state.cards,
            {
              ...card,
              id: state.nextId,
              status: "idea" as ColumnId,
              comments: [],
              createdAt: new Date().toISOString(),
            },
          ],
          nextId: state.nextId + 1,
        })),

      updateCard: (id, updates) =>
        set((state) => ({
          cards: state.cards.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),

      deleteCard: (id) =>
        set((state) => ({ cards: state.cards.filter((c) => c.id !== id) })),

      moveCard: (id, status) =>
        set((state) => ({
          cards: state.cards.map((c) => (c.id === id ? { ...c, status } : c)),
        })),

      addComment: (cardId, text) =>
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === cardId
              ? {
                  ...c,
                  comments: [
                    ...c.comments,
                    { author: state.commentAuthor, text, time: new Date().toISOString() },
                  ],
                }
              : c
          ),
        })),

      toggleSelect: (id) =>
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, _selected: !c._selected } : c
          ),
        })),

      selectAll: (status, filteredCards) =>
        set((state) => {
          const ids = new Set(filteredCards.map((c) => c.id));
          const allSelected = filteredCards.every((c) => c._selected);
          return {
            cards: state.cards.map((c) =>
              ids.has(c.id) ? { ...c, _selected: !allSelected } : c
            ),
          };
        }),

      bulkKeep: (ids) =>
        set((state) => ({
          cards: state.cards.map((c) =>
            ids.includes(c.id) ? { ...c, status: "drafting" as ColumnId, _selected: false } : c
          ),
        })),

      bulkReject: (ids) =>
        set((state) => ({ cards: state.cards.filter((c) => !ids.includes(c.id)) })),

      resetData: () =>
        set({ cards: [...SEED_IDEAS], nextId: 51 }),

      getFilteredCards: (status) => {
        const state = get();
        const { product, platform, pillar, search } = state.filters;
        return state.cards
          .filter((c) => c.status === status)
          .filter((c) => !product || c.products.includes(product))
          .filter((c) => !platform || c.platforms.includes(platform))
          .filter((c) => !pillar || c.pillar === pillar)
          .filter(
            (c) =>
              !search ||
              c.title.toLowerCase().includes(search.toLowerCase()) ||
              c.description.toLowerCase().includes(search.toLowerCase())
          );
      },
    }),
    {
      name: "content-command-center-storage",
      partialize: (state) => ({
        cards: state.cards.map(({ _selected, ...rest }) => rest),
        nextId: state.nextId,
        commentAuthor: state.commentAuthor,
        viewMode: state.viewMode,
      }),
    }
  )
);
