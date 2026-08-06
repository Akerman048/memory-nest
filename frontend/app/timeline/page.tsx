"use client";

import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";

import { AddMemoryModal } from "../nest/add-memory-modal";
import { MemoryCard } from "../nest/memory-card";
import { NestShell } from "../nest/nest-shell";
import { MemoryKind, memoryKindLabels } from "../nest/types";
import { useMemories } from "../nest/use-memories";

export default function TimelinePage() {
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState<"all" | MemoryKind>("all");
  const { memories, addMemory, deleteMemory } = useMemories();
  const shown = useMemo(() => [...memories].filter((m) => filter === "all" || m.kind === filter).sort((a, b) => b.date.localeCompare(a.date)), [memories, filter]);
  const groups = shown.reduce<Record<string, typeof shown>>((result, memory) => { const year = memory.date.slice(0, 4); (result[year] ??= []).push(memory); return result; }, {});
  const filters: Array<"all" | MemoryKind> = ["all", "photo", "video", "note", "milestone"];

  return <NestShell onAdd={() => setAdding(true)}><main className="mx-auto max-w-5xl px-5 pb-28 pt-9 sm:px-8 lg:px-12 lg:pb-14 lg:pt-12"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.17em] text-muted">Every chapter, together</p><h1 className="mt-2 text-4xl font-bold tracking-[-0.055em] sm:text-5xl">Family timeline</h1><p className="mt-3 text-muted">All memories in chronological order, newest first.</p></div><button onClick={() => setAdding(true)} className="flex items-center gap-2 self-start rounded-full bg-accent px-5 py-3 font-bold text-accent-foreground hover:bg-accent-hover"><FiPlus aria-hidden="true" />Add memory</button></div>
    <div className="mt-8 flex gap-2 overflow-x-auto pb-2">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${filter === item ? "bg-primary text-primary-foreground" : "bg-surface-strong text-muted"}`}>{item === "all" ? "All memories" : memoryKindLabels[item]}</button>)}</div>
    <div className="mt-10 space-y-12">{Object.entries(groups).map(([year, yearMemories]) => <section key={year} className="grid gap-5 md:grid-cols-[90px_1fr]"><h2 className="text-2xl font-bold">{year}</h2><div className="relative space-y-6 border-l border-primary/15 pl-6 before:absolute before:-left-[5px] before:top-2 before:size-2.5 before:rounded-full before:bg-accent-hover">{yearMemories.map((memory) => <MemoryCard key={memory.id} memory={memory} onDelete={deleteMemory} />)}</div></section>)}</div>
    {!shown.length ? <div className="mt-12 rounded-[28px] bg-surface-strong p-12 text-center"><p className="text-xl font-bold">No memories in this category yet.</p><button onClick={() => setAdding(true)} className="mt-3 font-semibold underline">Add one now</button></div> : null}
    </main><AddMemoryModal open={adding} onClose={() => setAdding(false)} onAdd={addMemory} /></NestShell>;
}
