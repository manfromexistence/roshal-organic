"use client";

import { Copy, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function LogoClipboard() {
  const [clipboard, setClipboard] = useState<string[]>([]);
  const [showClipboard, setShowClipboard] = useState(false);

  const addToClipboard = (logoName: string) => {
    if (!clipboard.includes(logoName)) {
      setClipboard([...clipboard, logoName]);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(clipboard.join("\n"));
  };

  const clearClipboard = () => {
    setClipboard([]);
  };

  return (
    <>
      {/* Clipboard Panel */}
      {showClipboard && (
        <div className="fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg p-4 z-50 w-80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">
              Broken Logos ({clipboard.length})
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowClipboard(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="max-h-40 overflow-y-auto mb-3">
            {clipboard.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Click on logos to add them here
              </p>
            ) : (
              <ul className="text-sm space-y-1">
                {clipboard.map((logo) => (
                  <li key={logo} className="text-muted-foreground">
                    {logo}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={copyToClipboard}
              disabled={clipboard.length === 0}
              className="flex-1"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={clearClipboard}
              disabled={clipboard.length === 0}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Toggle Clipboard Button */}
      <button
        type="button"
        onClick={() => setShowClipboard(!showClipboard)}
        className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg z-40 hover:bg-primary/90 transition-colors"
        style={{ display: showClipboard ? "none" : "block" }}
      >
        <Copy className="h-5 w-5" />
      </button>

      {/* Footer logos with click handlers */}
      <div id="logo-clipboard-handler" data-add-to-clipboard={addToClipboard} />
    </>
  );
}
