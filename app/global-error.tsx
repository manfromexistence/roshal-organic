"use client";

import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FlowerOfLifeSvg,
} from "@/components/ui/svg-shapes";

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-background">
        <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-destructive/20 w-full max-w-2xl h-auto"
          >
            <FlowerOfLifeSvg />
          </motion.div>
          <div className="text-center space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold bg-gradient-to-r from-destructive to-destructive/60 bg-clip-text text-transparent"
            >
              Critical Error
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-muted-foreground"
            >
              A critical error occurred. Please refresh the page or contact
              support if the problem persists.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button onClick={reset} variant="default">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
              </motion.div>
              Try Again
            </Button>
          </motion.div>
        </div>
      </body>
    </html>
  );
}
