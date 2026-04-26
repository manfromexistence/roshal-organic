"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ColorSelectorPopover } from "./color-selector-popover";

interface ColorPickerProps {
  color: string;
  onChange: (value: string) => void;
  label: string;
  name?: string;
}

export function ColorPicker({
  color,
  onChange,
  label,
  name,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.value = color;
    }
  }, [color]);

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  const handleTextInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div
      ref={rootRef}
      className={cn(
        "group hover:bg-muted/50 -mx-1 flex items-center gap-2.5 rounded-lg px-2 py-0.5 transition-all duration-200",
        shouldAnimate && "bg-muted ring-primary ring-2",
      )}
    >
      <div
        className="relative flex size-7 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border shadow-sm"
        style={{ backgroundColor: color }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="color"
          id={`color-${label.replace(/\s+/g, "-").toLowerCase()}`}
          value={color}
          onChange={handleColorChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>

      <span className="text-foreground min-w-0 shrink-0 text-[13px] font-medium">
        {label}
      </span>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
        <input
          ref={textInputRef}
          type="text"
          defaultValue={color}
          onChange={handleTextInputChange}
          className="bg-muted/50 text-muted-foreground focus:text-foreground focus:border-ring h-7 w-full min-w-0 rounded border px-2 text-xs font-mono transition-colors outline-none"
          placeholder="hex or tailwind"
        />
        <ColorSelectorPopover currentColor={color} onChange={onChange} />
      </div>
    </div>
  );
}

// Convert HSL string to hex for color input
function hslToHex(hsl: string): string {
  const match = hsl.match(
    /(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/,
  );
  if (!match) return "#000000";

  const h = Number.parseFloat(match[1]) / 360;
  const s = Number.parseFloat(match[2]) / 100;
  const l = Number.parseFloat(match[3]) / 100;

  let r = 0;
  let g = 0;
  let b = 0;

  if (s === 0) {
    r = l;
    g = l;
    b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
