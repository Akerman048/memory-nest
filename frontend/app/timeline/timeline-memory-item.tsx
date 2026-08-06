"use client";

/* eslint-disable @next/next/no-img-element */

import { FiCalendar, FiTrash2 } from "react-icons/fi";

import { memoryKindIcons } from "../nest/memory-icons";
import { Memory, memoryKindLabels } from "../nest/types";

const dayFormatter = new Intl.DateTimeFormat("en", { day: "2-digit" });
const monthFormatter = new Intl.DateTimeFormat("en", { month: "short" });
const fullDateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function TimelineMemoryItem({
  memory,
  onDelete,
}: {
  memory: Memory;
  onDelete: (id: string) => void;
}) {
  const date = new Date(`${memory.date}T12:00:00`);
  const KindIcon = memoryKindIcons[memory.kind];

  return (
    <article className="group relative grid gap-4 sm:grid-cols-[76px_1fr] sm:gap-6">
      <div className="relative z-10 hidden sm:block">
        <div className="flex size-[76px] flex-col items-center justify-center rounded-[24px] border border-primary/10 bg-background shadow-sm">
          <span className="text-2xl font-bold leading-none">{dayFormatter.format(date)}</span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            {monthFormatter.format(date)}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-primary/10 bg-surface-strong shadow-[0_14px_40px_rgba(15,60,101,0.08)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(15,60,101,0.13)]">
        <div className={memory.mediaUrl ? "grid lg:grid-cols-[minmax(220px,0.8fr)_1.2fr]" : ""}>
          {memory.mediaUrl ? (
            memory.kind === "video" ? (
              <video
                src={memory.mediaUrl}
                controls
                className="h-64 w-full bg-primary object-cover lg:h-full lg:min-h-72"
              />
            ) : (
              <img
                src={memory.mediaUrl}
                alt=""
                className="h-64 w-full object-cover lg:h-full lg:min-h-72"
              />
            )
          ) : null}

          <div className="p-6 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <KindIcon aria-hidden="true" />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-muted">
                  {memoryKindLabels[memory.kind]}
                </span>
              </div>
              <span className="flex items-center gap-2 text-sm text-muted sm:hidden">
                <FiCalendar aria-hidden="true" />
                {fullDateFormatter.format(date)}
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-bold tracking-[-0.035em] sm:text-3xl">
              {memory.title}
            </h3>
            {memory.description ? (
              <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-7 text-muted sm:text-base">
                {memory.description}
              </p>
            ) : null}

            <div className="mt-6 flex items-center justify-between border-t border-primary/10 pt-4">
              <span className="hidden items-center gap-2 text-sm text-muted sm:flex">
                <FiCalendar aria-hidden="true" />
                {fullDateFormatter.format(date)}
              </span>
              <button
                type="button"
                onClick={() => onDelete(memory.id)}
                className="ml-auto flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-muted opacity-100 transition hover:bg-red-50 hover:text-red-700 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                aria-label={`Delete ${memory.title}`}
              >
                <FiTrash2 aria-hidden="true" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
