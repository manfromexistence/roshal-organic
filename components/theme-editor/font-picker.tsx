"use client";

import { Check, ChevronDown, FunnelX } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface FontInfo {
  family: string;
  category: "sans-serif" | "serif" | "monospace" | "display" | "handwriting";
  variants: string[];
  variable?: boolean;
}

const POPULAR_FONTS: Record<string, FontInfo[]> = {
  "sans-serif": [
    {
      family: "Inter",
      category: "sans-serif",
      variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
      variable: true,
    },
    {
      family: "Roboto",
      category: "sans-serif",
      variants: ["100", "300", "400", "500", "700", "900"],
      variable: false,
    },
    {
      family: "Open Sans",
      category: "sans-serif",
      variants: ["300", "400", "500", "600", "700", "800"],
      variable: true,
    },
    {
      family: "Poppins",
      category: "sans-serif",
      variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
      variable: false,
    },
    {
      family: "Montserrat",
      category: "sans-serif",
      variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
      variable: true,
    },
    {
      family: "Lato",
      category: "sans-serif",
      variants: ["100", "300", "400", "700", "900"],
      variable: false,
    },
    {
      family: "Nunito",
      category: "sans-serif",
      variants: ["200", "300", "400", "500", "600", "700", "800", "900"],
      variable: true,
    },
    {
      family: "Raleway",
      category: "sans-serif",
      variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
      variable: true,
    },
    {
      family: "DM Sans",
      category: "sans-serif",
      variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
      variable: true,
    },
    {
      family: "Plus Jakarta Sans",
      category: "sans-serif",
      variants: ["200", "300", "400", "500", "600", "700", "800"],
      variable: true,
    },
    {
      family: "Geist",
      category: "sans-serif",
      variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
      variable: true,
    },
  ],
  serif: [
    {
      family: "Playfair Display",
      category: "serif",
      variants: ["400", "500", "600", "700", "800", "900"],
      variable: true,
    },
    {
      family: "Merriweather",
      category: "serif",
      variants: ["300", "400", "700", "900"],
      variable: false,
    },
    {
      family: "Lora",
      category: "serif",
      variants: ["400", "500", "600", "700"],
      variable: true,
    },
    {
      family: "PT Serif",
      category: "serif",
      variants: ["400", "700"],
      variable: false,
    },
    {
      family: "Noto Serif",
      category: "serif",
      variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
      variable: true,
    },
    {
      family: "Source Serif 4",
      category: "serif",
      variants: ["200", "300", "400", "500", "600", "700", "800", "900"],
      variable: true,
    },
    {
      family: "Libre Baskerville",
      category: "serif",
      variants: ["400", "700"],
      variable: false,
    },
    {
      family: "EB Garamond",
      category: "serif",
      variants: ["400", "500", "600", "700", "800"],
      variable: true,
    },
    {
      family: "Crimson Text",
      category: "serif",
      variants: ["400", "600", "700"],
      variable: false,
    },
    {
      family: "Bitter",
      category: "serif",
      variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
      variable: true,
    },
  ],
  monospace: [
    {
      family: "JetBrains Mono",
      category: "monospace",
      variants: ["100", "200", "300", "400", "500", "600", "700", "800"],
      variable: true,
    },
    {
      family: "Fira Code",
      category: "monospace",
      variants: ["300", "400", "500", "600", "700"],
      variable: true,
    },
    {
      family: "Source Code Pro",
      category: "monospace",
      variants: ["200", "300", "400", "500", "600", "700", "800", "900"],
      variable: true,
    },
    {
      family: "Roboto Mono",
      category: "monospace",
      variants: ["100", "200", "300", "400", "500", "600", "700"],
      variable: true,
    },
    {
      family: "IBM Plex Mono",
      category: "monospace",
      variants: ["100", "200", "300", "400", "500", "600", "700"],
      variable: false,
    },
    {
      family: "Space Mono",
      category: "monospace",
      variants: ["400", "700"],
      variable: false,
    },
    {
      family: "Ubuntu Mono",
      category: "monospace",
      variants: ["400", "700"],
      variable: false,
    },
    {
      family: "Inconsolata",
      category: "monospace",
      variants: ["200", "300", "400", "500", "600", "700", "800", "900"],
      variable: true,
    },
    {
      family: "Geist Mono",
      category: "monospace",
      variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
      variable: true,
    },
    {
      family: "Anonymous Pro",
      category: "monospace",
      variants: ["400", "700"],
      variable: false,
    },
    {
      family: "Red Hat Mono",
      category: "monospace",
      variants: ["300", "400", "500", "600", "700"],
      variable: true,
    },
  ],
  display: [
    {
      family: "Bebas Neue",
      category: "display",
      variants: ["400"],
      variable: false,
    },
    {
      family: "Abril Fatface",
      category: "display",
      variants: ["400"],
      variable: false,
    },
    {
      family: "Righteous",
      category: "display",
      variants: ["400"],
      variable: false,
    },
    {
      family: "Fredoka",
      category: "display",
      variants: ["300", "400", "500", "600", "700"],
      variable: true,
    },
    {
      family: "Lobster",
      category: "display",
      variants: ["400"],
      variable: false,
    },
    {
      family: "Comfortaa",
      category: "display",
      variants: ["300", "400", "500", "600", "700"],
      variable: true,
    },
    {
      family: "Alfa Slab One",
      category: "display",
      variants: ["400"],
      variable: false,
    },
    {
      family: "Bungee",
      category: "display",
      variants: ["400"],
      variable: false,
    },
    {
      family: "Lilita One",
      category: "display",
      variants: ["400"],
      variable: false,
    },
    {
      family: "Permanent Marker",
      category: "display",
      variants: ["400"],
      variable: false,
    },
  ],
  handwriting: [
    {
      family: "Dancing Script",
      category: "handwriting",
      variants: ["400", "500", "600", "700"],
      variable: true,
    },
    {
      family: "Pacifico",
      category: "handwriting",
      variants: ["400"],
      variable: false,
    },
    {
      family: "Caveat",
      category: "handwriting",
      variants: ["400", "500", "600", "700"],
      variable: true,
    },
    {
      family: "Satisfy",
      category: "handwriting",
      variants: ["400"],
      variable: false,
    },
    {
      family: "Great Vibes",
      category: "handwriting",
      variants: ["400"],
      variable: false,
    },
    {
      family: "Sacramento",
      category: "handwriting",
      variants: ["400"],
      variable: false,
    },
    {
      family: "Kalam",
      category: "handwriting",
      variants: ["300", "400", "700"],
      variable: false,
    },
    {
      family: "Patrick Hand",
      category: "handwriting",
      variants: ["400"],
      variable: false,
    },
    {
      family: "Indie Flower",
      category: "handwriting",
      variants: ["400"],
      variable: false,
    },
    {
      family: "Shadows Into Light",
      category: "handwriting",
      variants: ["400"],
      variable: false,
    },
  ],
};

// Flatten all fonts into a single array
const ALL_FONTS = Object.values(POPULAR_FONTS).flat();

type FilterFontCategory =
  | "all"
  | "sans-serif"
  | "serif"
  | "monospace"
  | "display"
  | "handwriting";

interface FontPickerProps {
  value?: string;
  category?: FilterFontCategory;
  onSelect: (font: FontInfo) => void;
  placeholder?: string;
  className?: string;
}

function buildFontFamily(family: string, category: string): string {
  return `${family}, ${category}`;
}

function FontItem({
  font,
  isSelected,
  onSelect,
}: {
  font: FontInfo;
  isSelected: boolean;
  onSelect: (font: FontInfo) => void;
}) {
  const fontFamily = buildFontFamily(font.family, font.category);

  return (
    <CommandItem
      className="flex cursor-pointer items-center justify-between gap-2 p-2"
      onSelect={() => onSelect(font)}
    >
      <div className="line-clamp-1 inline-flex w-full flex-1 flex-col justify-between">
        <span
          className="inline-flex items-center gap-2 truncate"
          style={{ fontFamily }}
        >
          {font.family}
        </span>
        <div className="flex items-center gap-1 text-xs font-normal opacity-70">
          <span>{font.category}</span>
          {font.variable && (
            <span className="inline-flex items-center gap-1">
              <span>•</span>
              <span>Variable</span>
            </span>
          )}
        </div>
      </div>
      {isSelected && <Check className="size-4 shrink-0 opacity-70" />}
    </CommandItem>
  );
}

export function FontPicker({
  value,
  category,
  onSelect,
  placeholder = "Search fonts...",
  className,
}: FontPickerProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FilterFontCategory>(
    category || "all",
  );

  // Filter fonts based on search and category
  const filteredFonts = useMemo(() => {
    let fonts = ALL_FONTS;

    // Filter by category
    if (selectedCategory !== "all") {
      fonts = fonts.filter((font) => font.category === selectedCategory);
    }

    // Filter by search
    if (inputValue.trim()) {
      const query = inputValue.toLowerCase();
      fonts = fonts.filter(
        (font) =>
          font.family.toLowerCase().includes(query) ||
          font.category.toLowerCase().includes(query),
      );
    }

    return fonts;
  }, [inputValue, selectedCategory]);

  // Get current font info for display
  const currentFont = useMemo(() => {
    if (!value) return null;

    // Try to find the font in the filtered list
    const foundFont = filteredFonts.find((font) => font.family === value);
    if (foundFont) return foundFont;

    // If not found, create a fallback FontInfo object
    const extractedFontName = value.split(",")[0].trim().replace(/['"]/g, "");

    return {
      family: extractedFontName,
      category: category || "sans-serif",
      variants: ["400"],
      variable: false,
    } as FontInfo;
  }, [value, filteredFonts, category]);

  const handleFontSelect = useCallback(
    (font: FontInfo) => {
      onSelect(font);
      setOpen(false);
    },
    [onSelect],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn("bg-input/25 w-full justify-between", className)}
        >
          <div className="flex items-center gap-2">
            {currentFont ? (
              <span className="inline-flex items-center gap-2">
                <span
                  style={{
                    fontFamily: buildFontFamily(
                      currentFont.family,
                      currentFont.category,
                    ),
                  }}
                >
                  {currentFont.family}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false} className="h-96 w-full overflow-hidden">
          <div className="flex flex-col">
            <div className="relative">
              <CommandInput
                className="h-10 w-full border-none p-0 pr-10"
                placeholder="Search fonts..."
                value={inputValue}
                onValueChange={setInputValue}
              />

              {inputValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInputValue("")}
                  className="absolute top-2 right-2 size-6"
                  title="Clear search"
                >
                  <FunnelX className="size-4" />
                </Button>
              )}
            </div>

            <div className="px-2 py-1">
              <Select
                value={selectedCategory}
                onValueChange={(value) =>
                  setSelectedCategory(value as FilterFontCategory)
                }
              >
                <SelectTrigger
                  size="sm"
                  className="focus bg-input/25 px-2 text-xs outline-none"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fonts</SelectItem>
                  <SelectItem value="sans-serif">Sans Serif Fonts</SelectItem>
                  <SelectItem value="serif">Serif Fonts</SelectItem>
                  <SelectItem value="monospace">Monospace Fonts</SelectItem>
                  <SelectItem value="display">Display Fonts</SelectItem>
                  <SelectItem value="handwriting">Handwriting Fonts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="relative isolate size-full">
            {filteredFonts.length === 0 ? (
              <CommandEmpty>No fonts found.</CommandEmpty>
            ) : (
              <CommandList className="scrollbar-thin size-full p-1">
                <CommandGroup>
                  {filteredFonts.map((font) => (
                    <FontItem
                      key={font.family}
                      font={font}
                      isSelected={font.family === value}
                      onSelect={handleFontSelect}
                    />
                  ))}
                </CommandGroup>
              </CommandList>
            )}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
