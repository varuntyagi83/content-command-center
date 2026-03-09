import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Content Command Center",
  description: "Shared content strategy board — Voltic · AdForge · AI Catalyst",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
