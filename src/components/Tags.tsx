"use client";

import { getProductColor } from "@/lib/types";

export function ProductTag({ product }: { product: string }) {
  const { bg, text } = getProductColor(product);
  return (
    <span className="tag" style={{ background: bg, color: text }}>
      {product}
    </span>
  );
}

export function PlatformTag({ platform }: { platform: string }) {
  return (
    <span className="tag" style={{ background: "#1e293b", color: "#94a3b8" }}>
      {platform}
    </span>
  );
}
