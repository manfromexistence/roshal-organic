import { create } from "zustand";

interface NavStore {
  expandedItems: Record<string, boolean>;
  setExpandedItems: (items: Record<string, boolean>) => void;
  toggleItem: (title: string, isOpen: boolean) => void;
  initialize: (items: Record<string, boolean>) => void;
}

export const useNavStore = create<NavStore>((set) => ({
  expandedItems: {},
  setExpandedItems: (items) => set({ expandedItems: items }),
  toggleItem: (title, isOpen) =>
    set((state) => ({
      expandedItems: { ...state.expandedItems, [title]: isOpen },
    })),
  initialize: (items) => set({ expandedItems: items }),
}));
