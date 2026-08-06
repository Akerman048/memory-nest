import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Memory Nest",
  description: "Private online family album where parents can store photos, videos, milestones and stories about their children",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
