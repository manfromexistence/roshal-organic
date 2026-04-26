"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export function DashboardFormCheckbox({
  name,
  defaultChecked,
  label,
}: {
  name: string;
  defaultChecked: boolean;
  label: string;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <label className="flex items-center gap-3 text-sm font-medium">
      <input type="hidden" name={name} value={checked ? "true" : "false"} />
      <Checkbox
        checked={checked}
        onCheckedChange={(value) => setChecked(Boolean(value))}
      />
      <span>{label}</span>
    </label>
  );
}
