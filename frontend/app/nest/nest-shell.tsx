"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: "⌂" },
  { href: "/timeline", label: "Timeline", icon: "◷" },
  { href: "/profile", label: "Profile", icon: "♡" },
];

export function NestShell({ children, onAdd }: { children: ReactNode; onAdd?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f7f4ed] text-[#173d3b]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[#173d3b]/8 bg-[#fbfaf6]/90 px-5 py-7 backdrop-blur-xl lg:flex lg:flex-col">
        <Link href="/dashboard" className="flex items-center gap-3 px-2">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-[#f3d887] text-xl">⌁</span>
          <span className="text-xl font-bold tracking-[-0.04em]">Memory Nest</span>
        </Link>
        <nav className="mt-12 space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-[#173d3b] text-white shadow-lg" : "text-[#61726f] hover:bg-white hover:text-[#173d3b]"}`}>
                <span className="text-lg">{item.icon}</span>{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-[24px] bg-[#e7efe7] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6a7e79]">Private nest</p>
          <p className="mt-2 text-sm leading-6">Your family moments stay together in one calm, personal space.</p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[#173d3b]/8 bg-[#f7f4ed]/85 px-5 backdrop-blur-xl sm:px-8 lg:px-12">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold lg:hidden"><span className="flex size-9 items-center justify-center rounded-xl bg-[#f3d887]">⌁</span>Memory Nest</Link>
          <p className="hidden text-sm text-[#6a7e79] lg:block">A gentle place for all the moments that matter.</p>
          <div className="flex items-center gap-3">
            {onAdd ? <button onClick={onAdd} className="rounded-full bg-[#173d3b] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 sm:px-5">＋ Add memory</button> : null}
            <span className="flex size-10 items-center justify-center rounded-full bg-[#d9e7dc] font-bold">A</span>
          </div>
        </header>
        {children}
      </div>

      <nav className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-around rounded-[22px] border border-white/80 bg-white/90 p-2 shadow-[0_16px_45px_rgba(23,61,59,0.18)] backdrop-blur-xl lg:hidden">
        {navItems.map((item) => <Link key={item.href} href={item.href} className={`flex min-w-20 flex-col items-center rounded-2xl px-3 py-2 text-xs font-semibold ${pathname === item.href ? "bg-[#173d3b] text-white" : "text-[#6a7e79]"}`}><span className="text-lg">{item.icon}</span>{item.label}</Link>)}
      </nav>
    </div>
  );
}
