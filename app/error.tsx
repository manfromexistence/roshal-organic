"use client";

import { motion } from "framer-motion";
import { Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FlowerOfLifeSvg,
  GoldenSpiralSvg,
  MetatronsCubeSvg,
  SeedOfLifeSvg,
  SriYantraSvg,
  VesicaPiscisSvg,
} from "@/components/ui/svg-shapes";

const sacredGeometryShapes = [
  FlowerOfLifeSvg,
  MetatronsCubeSvg,
  SriYantraSvg,
  SeedOfLifeSvg,
  VesicaPiscisSvg,
  GoldenSpiralSvg,
];

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const [Shape, setShape] = useState<
    (typeof sacredGeometryShapes)[number] | null
  >(null);

  useEffect(() => {
    const idx = Math.floor(Math.random() * sacredGeometryShapes.length);
    setShape(() => sacredGeometryShapes[idx]);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] px-4 gap-2">
      {Shape && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-destructive/20 w-full max-w-2xl h-auto"
        >
          <Shape />
        </motion.div>
      )}
      <div className="text-center space-y-2">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold bg-gradient-to-r from-destructive to-destructive/60 bg-clip-text text-transparent"
        >
          Something went wrong
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground"
        >
          {error.message || "An unexpected error occurred. Please try again."}
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3"
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
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
