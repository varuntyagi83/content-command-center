import { create } from "zustand";
import { ContentCard, ColumnId, Filters } from "./types";
import { fetchCards, apiAddCard, apiUpdateCard, apiDeleteCard, apiBulkKeep, apiBulkReject, apiAddComment, apiDeleteComment, apiSeed } from "./api";

type SyncStatus = "idle" | "syncing" | "error";

interface AppState {
  cards: ContentCard[];
  commentAuthor: string;
  viewMode: "kanban" | "list";
  filters: Filters;
  syncStatus: SyncStatus;
  lastSync: string;

  // Init & sync
  init: () => Promise<void>;
  refresh: () => Promise<void>;

  // UI
  setCommentAuthor: (a: string) => void;
  setViewMode: (m: "kanban" | "list") => void;
  setFilters: (f: Filters) => void;
  toggleSelect: (id: string) => void;
  selectAll: (status: ColumnId) => void;

  // Data operations (hit API then refresh)
  addCard: (card: Partial<ContentCard>) => Promise<void>;
  updateCard: (id: string, updates: Partial<ContentCard>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  moveCard: (id: string, status: ColumnId) => Promise<void>;
  addComment: (cardId: string, text: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  bulkKeep: () => Promise<void>;
  bulkReject: () => Promise<void>;
  resetData: () => Promise<void>;

  getFilteredCards: (status: ColumnId) => ContentCard[];
}

export const useStore = create<AppState>()((set, get) => ({
  cards: [],
  commentAuthor: (typeof window !== "undefined" ? localStorage.getItem("commentAuthor") : null) ?? "Varun",
  viewMode: "kanban",
  filters: { product: "", platform: "", pillar: "", search: "" },
  syncStatus: "idle",
  lastSync: "",

  init: async () => {
    set({ syncStatus: "syncing" });
    try {
      const cards = await fetchCards();
      set({ cards, syncStatus: "idle", lastSync: new Date().toISOString() });
    } catch {
      set({ syncStatus: "error" });
    }
  },

  refresh: async () => {
    try {
      const cards = await fetchCards();
      // Preserve local _selected state
      const selected = new Set(get().cards.filter(c => c._selected).map(c => c.id));
      set({
        cards: cards.map(c => ({ ...c, _selected: selected.has(c.id) })),
        syncStatus: "idle",
        lastSync: new Date().toISOString(),
      });
    } catch {
      set({ syncStatus: "error" });
    }
  },

  setCommentAuthor: (a) => {
    if (typeof window !== "undefined") localStorage.setItem("commentAuthor", a);
    set({ commentAuthor: a });
  },
  setViewMode: (m) => set({ viewMode: m }),
  setFilters: (f) => set({ filters: f }),

  toggleSelect: (id) => set(s => ({
    cards: s.cards.map(c => c.id === id ? { ...c, _selected: !c._selected } : c),
  })),

  selectAll: (status) => {
    const filtered = get().getFilteredCards(status);
    const allSelected = filtered.every(c => c._selected);
    const ids = new Set(filtered.map(c => c.id));
    set(s => ({
      cards: s.cards.map(c => ids.has(c.id) ? { ...c, _selected: !allSelected } : c),
    }));
  },

  addCard: async (card) => {
    set({ syncStatus: "syncing" });
    try {
      await apiAddCard(card);
      await get().refresh();
    } catch {
      set({ syncStatus: "error" });
    }
  },

  updateCard: async (id, updates) => {
    set({ syncStatus: "syncing" });
    try {
      await apiUpdateCard(id, updates);
      await get().refresh();
    } catch {
      set({ syncStatus: "error" });
    }
  },

  deleteCard: async (id) => {
    set({ syncStatus: "syncing" });
    try {
      await apiDeleteCard(id);
      await get().refresh();
    } catch {
      set({ syncStatus: "error" });
    }
  },

  moveCard: async (id, status) => {
    // Optimistic update
    set(s => ({
      cards: s.cards.map(c => c.id === id ? { ...c, status } : c),
      syncStatus: "syncing",
    }));
    try {
      await apiUpdateCard(id, { status });
      await get().refresh();
    } catch {
      await get().refresh(); // rolls back optimistic update
      set({ syncStatus: "error" });
    }
  },

  addComment: async (cardId, text) => {
    set({ syncStatus: "syncing" });
    try {
      await apiAddComment(cardId, get().commentAuthor, text);
      await get().refresh();
    } catch {
      set({ syncStatus: "error" });
    }
  },

  deleteComment: async (commentId) => {
    set({ syncStatus: "syncing" });
    try {
      await apiDeleteComment(commentId);
      await get().refresh();
    } catch {
      set({ syncStatus: "error" });
    }
  },

  bulkKeep: async () => {
    const ids = get().getFilteredCards("idea").filter(c => c._selected).map(c => c.id);
    if (!ids.length) return;
    set({ syncStatus: "syncing" });
    try {
      await apiBulkKeep(ids);
      await get().refresh();
    } catch {
      set({ syncStatus: "error" });
    }
  },

  bulkReject: async () => {
    const ids = get().getFilteredCards("idea").filter(c => c._selected).map(c => c.id);
    if (!ids.length) return;
    set({ syncStatus: "syncing" });
    try {
      await apiBulkReject(ids);
      await get().refresh();
    } catch {
      set({ syncStatus: "error" });
    }
  },

  resetData: async () => {
    set({ syncStatus: "syncing" });
    try {
      await apiSeed();
      await get().refresh();
    } catch {
      set({ syncStatus: "error" });
    }
  },

  getFilteredCards: (status) => {
    const { cards, filters } = get();
    return cards
      .filter(c => c.status === status)
      .filter(c => !filters.product || c.products.includes(filters.product))
      .filter(c => !filters.platform || c.platforms.includes(filters.platform))
      .filter(c => !filters.pillar || c.pillar === filters.pillar)
      .filter(c => !filters.search ||
        c.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.description.toLowerCase().includes(filters.search.toLowerCase()));
  },
}));
