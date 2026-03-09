import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Content Command Center",
  description: "Shared content strategy board for Voltic, AdForge & AI Catalyst",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
