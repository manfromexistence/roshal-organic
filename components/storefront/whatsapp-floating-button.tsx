"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function WhatsAppFloatingButton({
  facebookHref: _facebookHref,
  href,
  label,
}: {
  facebookHref?: string;
  href: string;
  label: string;
}) {
  return (
    <Button
      asChild
      className="fixed bottom-[5rem] right-3.5 z-[70] rounded-sm px-3 py-2 shadow-lg md:bottom-3"
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
