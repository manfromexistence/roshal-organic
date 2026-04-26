"use client";

import { useNavStore } from "@/stores/nav-store";

interface NavStoreInitializerProps {
  children: React.ReactNode;
  initialState: Record<string, boolean>;
}

export function NavStoreInitializer({
  children,
  initialState,
}: NavStoreInitializerProps) {
  // Initialize store synchronously before render
  useNavStore.setState({ expandedItems: initialState });

  return <>{children}</>;
}
