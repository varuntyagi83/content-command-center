"use client";

import { useRef, useState } from "react";
import { useStore } from "@/lib/store";

export default function QuickAdd() {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const addCard = useStore((s) => s.addCard);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    addCard({
      title: value.trim(),
      description: "",
      products: [],
      platforms: [],
      pillar: "",
      funnel: "",
      priority: "🟡 Medium",
      optimization: "",
    });
    setValue("");
    ref.current?.focus();
  };

  return (
    <div className="px-6 py-3 border-b border-surface-border-light">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="⚡ Quick add — type an idea and press Enter..."
          className="flex-1 bg-[#12121f] border border-surface-border rounded-lg px-3.5 py-2.5 text-[#e2e8f0] text-sm outline-none focus:border-accent"
        />
        <button type="submit" className="btn bg-surface-elevated text-accent-light px-4 py-2.5 rounded-lg text-sm font-semibold">
          Add →
        </button>
      </form>
    </div>
  );
}
