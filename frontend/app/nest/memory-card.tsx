"use client";

/* eslint-disable @next/next/no-img-element */

import { FiTrash2 } from "react-icons/fi";

import { memoryKindIcons } from "./memory-icons";
import { Memory, memoryKindLabels } from "./types";

const formatter = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" });

export function MemoryCard({ memory, onDelete, compact = false }: { memory: Memory; onDelete?: (id: string) => void; compact?: boolean }) {
  const date = formatter.format(new Date(`${memory.date}T12:00:00`));
  const KindIcon = memoryKindIcons[memory.kind];
  return (
    <article className="group overflow-hidden rounded-[26px] border border-primary/10 bg-surface-strong shadow-lg">
      {memory.mediaUrl ? (
        memory.kind === "video" ? <video src={memory.mediaUrl} controls className={`w-full bg-primary object-cover ${compact ? "h-44" : "max-h-[420px]"}`} /> : <img src={memory.mediaUrl} alt="" className={`w-full object-cover ${compact ? "h-44" : "max-h-[420px]"}`} />
      ) : <div className={`flex items-center justify-center bg-gradient-to-br from-accent to-primary-soft text-5xl ${compact ? "h-36" : "h-48"}`}><KindIcon aria-hidden="true" /></div>}
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.13em] text-muted">
          <span>{memoryKindLabels[memory.kind]} · {date}</span>
          {onDelete ? <button onClick={() => onDelete(memory.id)} aria-label={`Delete ${memory.title}`} className="flex items-center gap-1 normal-case tracking-normal opacity-0 transition hover:text-red-600 group-hover:opacity-100 focus:opacity-100"><FiTrash2 aria-hidden="true" />Delete</button> : null}
        </div>
        <h3 className="mt-3 text-xl font-bold tracking-[-0.03em]">{memory.title}</h3>
        {memory.description ? <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{memory.description}</p> : null}
      </div>
    </article>
  );
}
