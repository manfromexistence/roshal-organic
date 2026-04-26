export type CellPosition = {
  rowIndex: number;
  columnId: string;
};

export type CellUpdate = {
  rowIndex: number;
  columnId: string;
  value: unknown;
};

export type ContextMenuState = {
  open: boolean;
  x: number;
  y: number;
};

export type Direction = "ltr" | "rtl";

export type FileCellData = {
  url: string;
  name: string;
  size?: number;
  type?: string;
};

export type NavigationDirection =
  | "up"
  | "down"
  | "left"
  | "right"
  | "first"
  | "last"
  | "pageUp"
  | "pageDown"
  | "pageup"
  | "pagedown"
  | "pageleft"
  | "pageright"
  | "home"
  | "end"
  | "ctrl+home"
  | "ctrl+end"
  | "ctrl+up"
  | "ctrl+down";

export type PasteDialogState = {
  open: boolean;
  rowsNeeded: number;
  clipboardText: string;
};

export type RowHeightValue = "short" | "medium" | "tall" | number;

export type SearchState = {
  searchMatches: CellPosition[];
  matchIndex: number;
  searchOpen: boolean;
  onSearchOpenChange: (open: boolean) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: (query: string) => void;
  onNavigateToNextMatch: () => void;
  onNavigateToPrevMatch: () => void;
};

export type SelectionState = {
  selectedCells: Set<unknown>;
  selectionRange: { start: CellPosition; end: CellPosition } | null;
  isSelecting: boolean;
};
