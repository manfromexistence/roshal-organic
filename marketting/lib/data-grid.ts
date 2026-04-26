import type { FileCellData, RowHeightValue } from "@/types/data-grid";

/**
 * Generate a unique key for a cell based on row and column IDs.
 */
export function getCellKey(
  rowIndex: number | string,
  columnId: string,
): string {
  return `${String(rowIndex)}\0${columnId}`;
}

/**
 * Parse a cell key back into its row and column components.
 */
export function parseCellKey(key: string): {
  rowIndex: number;
  columnId: string;
} {
  const parts = key.split("\0");
  return {
    rowIndex: Number.parseInt(parts[0] ?? "0", 10),
    columnId: parts[1] ?? "",
  };
}

/**
 * Get the empty/default value for a cell.
 */
export function getEmptyCellValue(_variant?: string): unknown {
  return "";
}

/**
 * Check if a value is file cell data.
 */
export function getIsFileCellData(value: unknown): value is FileCellData {
  return (
    typeof value === "object" &&
    value !== null &&
    "url" in value &&
    "name" in value
  );
}

/**
 * Check if an element is inside a popover or dropdown menu.
 * This is used to prevent keyboard shortcuts from triggering when
 * the user is editing content inside a popover.
 */
export function getIsInPopover(element: Element | EventTarget | null): boolean {
  if (!element) return false;
  if (!(element instanceof Element)) return false;

  // Check if element or any of its parents has a popover-related attribute
  let current: Element | null = element;
  while (current) {
    // Check for Radix UI popover/dropdown attributes
    if (
      current.getAttribute("data-state") === "open" &&
      (current.getAttribute("data-radix-popper-content-wrapper") !== null ||
        current.hasAttribute("data-popover-content") ||
        current.hasAttribute("data-dropdown-menu-content"))
    ) {
      return true;
    }

    // Check if inside a role="dialog" or role="menu"
    const role = current.getAttribute("role");
    if (role === "dialog" || role === "menu" || role === "listbox") {
      return true;
    }

    current = current.parentElement;
  }

  return false;
}

/**
 * Get the numeric height value for a row height setting.
 */
export function getRowHeightValue(height: RowHeightValue): number {
  if (typeof height === "number") return height;
  switch (height) {
    case "short":
      return 40;
    case "medium":
      return 60;
    case "tall":
      return 80;
    default:
      return 40;
  }
}

/**
 * Determine scroll direction based on previous and current scroll positions.
 */
export function getScrollDirection(
  prev: number,
  current: number,
  _direction?: string,
): "up" | "down" | null {
  if (current > prev) return "down";
  if (current < prev) return "up";
  return null;
}

/**
 * Check if a value matches a select option.
 */
export function matchSelectOption(value: unknown, option: unknown): boolean {
  return String(value) === String(option);
}

/**
 * Parse TSV (tab-separated values) into a 2D array.
 */
export function parseTsv(tsv: string, _columnCount?: number): string[][] {
  const lines = tsv.trim().split("\n");
  return lines.map((line) => line.split("\t"));
}

/**
 * Scroll a cell into view.
 */
export function scrollCellIntoView(
  elementOrOptions:
    | HTMLElement
    | {
        container: HTMLElement;
        targetCell: HTMLElement;
        tableRef: unknown;
        viewportOffset?: number;
        direction?: "up" | "down" | "left" | "right" | "home" | "end" | null;
        isRtl?: boolean;
      },
  options?: ScrollIntoViewOptions,
): void {
  if (elementOrOptions instanceof HTMLElement) {
    elementOrOptions.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      ...options,
    });
  } else {
    // Handle the object-based call from use-data-grid
    const { targetCell } = elementOrOptions;
    targetCell.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }
}
