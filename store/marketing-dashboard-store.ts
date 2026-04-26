"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type MarketingDashboardTab = "sections" | "guides";

interface MarketingDashboardState {
  activeTab: MarketingDashboardTab;
  search: string;
  showDisabled: boolean;
  selectedSectionKey: string | null;
  setActiveTab: (tab: MarketingDashboardTab) => void;
  setSearch: (value: string) => void;
  setShowDisabled: (value: boolean) => void;
  setSelectedSectionKey: (value: string | null) => void;
  reset: () => void;
}

const defaultState = {
  activeTab: "sections" as MarketingDashboardTab,
  search: "",
  showDisabled: true,
  selectedSectionKey: null,
};

export const useMarketingDashboardStore = create<MarketingDashboardState>()(
  persist(
    (set) => ({
      ...defaultState,
      setActiveTab: (activeTab) => set({ activeTab }),
      setSearch: (search) => set({ search }),
      setShowDisabled: (showDisabled) => set({ showDisabled }),
      setSelectedSectionKey: (selectedSectionKey) =>
        set({ selectedSectionKey }),
      reset: () => set(defaultState),
    }),
    {
      name: "roshal-marketing-dashboard",
    },
  ),
);
