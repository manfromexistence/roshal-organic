"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function WhatsAppFloatingButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Button
      asChild
      className="fixed bottom-24 right-4 z-[70] rounded-md px-4 py-3 shadow-lg md:bottom-6"
    >
      <Link
        href={href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2"
      >
        <MessageCircle className="size-4" />
        <span>{label}</span>
      </Link>
    </Button>
  );
}
