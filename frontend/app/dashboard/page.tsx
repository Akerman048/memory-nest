"use client";

import Link from "next/link";
import { useState } from "react";
import { FiArrowRight, FiHeart, FiImage, FiPlus, FiStar } from "react-icons/fi";

import { AddMemoryModal } from "../nest/add-memory-modal";
import { MemoryCard } from "../nest/memory-card";
import { NestShell } from "../nest/nest-shell";
import { useMemories } from "../nest/use-memories";

export default function DashboardPage() {
  const [adding, setAdding] = useState(false);
  const { memories, isReady, error, addMemory, deleteMemory } = useMemories();
  const recent = [...memories].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  return (
    <NestShell onAdd={() => setAdding(true)}>
      <main className="mx-auto max-w-7xl px-5 pb-28 pt-8 sm:px-8 lg:px-12 lg:pb-12 lg:pt-12">
        {error ? <p role="alert" className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        <section className="relative overflow-hidden rounded-[34px] bg-primary px-6 py-9 text-primary-foreground shadow-xl sm:px-10 sm:py-12">
          <div className="absolute -right-16 -top-16 size-64 rounded-full bg-accent/20 blur-2xl" /><div className="relative max-w-2xl"><p className="text-sm font-semibold text-primary-soft">Thursday, 6 August</p><h1 className="mt-3 text-4xl font-bold tracking-[-0.055em] sm:text-5xl">Good morning, Alex.</h1><p className="mt-4 max-w-xl text-base leading-7 text-primary-soft sm:text-lg">What little moment would you like to keep today?</p><button onClick={() => setAdding(true)} className="mt-7 flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-bold text-accent-foreground transition hover:-translate-y-0.5 hover:bg-accent-hover"><FiPlus aria-hidden="true" />Add today&apos;s memory</button></div>
        </section>

        <section className="mt-9 grid gap-4 sm:grid-cols-3">
          {[{ value: memories.length, label: "Memories saved", icon: FiHeart }, { value: memories.filter((m) => m.kind === "photo" || m.kind === "video").length, label: "Photos & videos", icon: FiImage }, { value: memories.filter((m) => m.kind === "milestone").length, label: "Milestones", icon: FiStar }].map((stat) => <div key={stat.label} className="rounded-[24px] border border-primary/10 bg-surface-strong p-5"><div className="flex items-center justify-between"><span className="text-sm font-medium text-muted">{stat.label}</span><span className="flex size-9 items-center justify-center rounded-xl bg-accent"><stat.icon aria-hidden="true" /></span></div><p className="mt-3 text-3xl font-bold">{isReady ? stat.value : "—"}</p></div>)}
        </section>

        <section className="mt-11"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.17em] text-muted">Close to heart</p><h2 className="mt-2 text-3xl font-bold tracking-[-0.04em]">Recently added</h2></div><Link href="/timeline" className="flex items-center gap-2 text-sm font-bold hover:underline">View all <FiArrowRight aria-hidden="true" /></Link></div>
          {recent.length ? <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{recent.map((memory) => <MemoryCard key={memory.id} memory={memory} onDelete={deleteMemory} compact />)}</div> : <div className="mt-6 rounded-[28px] border border-dashed border-primary/20 p-12 text-center"><p className="text-lg font-bold">Your nest is ready.</p><button onClick={() => setAdding(true)} className="mt-3 text-sm font-semibold underline">Add the first memory</button></div>}
        </section>
      </main>
      <AddMemoryModal open={adding} onClose={() => setAdding(false)} onAdd={addMemory} />
    </NestShell>
  );
}
