"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { FiClock, FiFeather, FiHome, FiLock, FiPlus, FiUser } from "react-icons/fi";

const navItems = [
  { href: "/dashboard", label: "Home", icon: FiHome },
  { href: "/timeline", label: "Timeline", icon: FiClock },
  { href: "/profile", label: "Profile", icon: FiUser },
];

export function NestShell({ children, onAdd }: { children: ReactNode; onAdd?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-primary/10 bg-background/90 px-5 py-7 backdrop-blur-xl lg:flex lg:flex-col">
        <Link href="/dashboard" className="flex items-center gap-3 px-2">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-xl"><FiFeather aria-hidden="true" /></span>
          <span className="text-xl font-bold tracking-[-0.04em]">Memory Nest</span>
        </Link>
        <nav className="mt-12 space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-primary text-primary-foreground shadow-lg" : "text-muted hover:bg-surface-strong hover:text-primary"}`}>
                <item.icon className="text-lg" aria-hidden="true" />{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-[24px] bg-primary-soft p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted"><FiLock aria-hidden="true" />Private nest</p>
          <p className="mt-2 text-sm leading-6">Your family moments stay together in one calm, personal space.</p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-primary/10 bg-background/85 px-5 backdrop-blur-xl sm:px-8 lg:px-12">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold lg:hidden"><span className="flex size-9 items-center justify-center rounded-xl bg-accent"><FiFeather aria-hidden="true" /></span>Memory Nest</Link>
          <p className="hidden text-sm text-muted lg:block">A gentle place for all the moments that matter.</p>
          <div className="flex items-center gap-3">
            {onAdd ? <button onClick={onAdd} className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:-translate-y-0.5 hover:bg-primary-hover sm:px-5"><FiPlus aria-hidden="true" />Add memory</button> : null}
            <span className="flex size-10 items-center justify-center rounded-full bg-primary-soft font-bold">A</span>
          </div>
        </header>
        {children}
      </div>

      <nav className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-around rounded-[22px] border border-border bg-surface-strong p-2 shadow-xl backdrop-blur-xl lg:hidden">
        {navItems.map((item) => <Link key={item.href} href={item.href} className={`flex min-w-20 flex-col items-center rounded-2xl px-3 py-2 text-xs font-semibold ${pathname === item.href ? "bg-primary text-primary-foreground" : "text-muted"}`}><item.icon className="text-lg" aria-hidden="true" />{item.label}</Link>)}
      </nav>
    </div>
  );
}
