"use client";

import { useMemo, useState } from "react";
import {
  FiArrowDown,
  FiArrowUp,
  FiBookOpen,
  FiCalendar,
  FiClock,
  FiImage,
  FiPlus,
  FiSearch,
  FiStar,
  FiVideo,
  FiX,
} from "react-icons/fi";

import { AddMemoryModal } from "../nest/add-memory-modal";
import { NestShell } from "../nest/nest-shell";
import { MemoryKind, memoryKindLabels } from "../nest/types";
import { useMemories } from "../nest/use-memories";
import { TimelineMemoryItem } from "./timeline-memory-item";

type TimelineFilter = "all" | MemoryKind;
type SortDirection = "newest" | "oldest";

const filterOptions: Array<{
  value: TimelineFilter;
  label: string;
  icon: typeof FiClock;
}> = [
  { value: "all", label: "All memories", icon: FiClock },
  { value: "photo", label: memoryKindLabels.photo, icon: FiImage },
  { value: "video", label: memoryKindLabels.video, icon: FiVideo },
  { value: "note", label: memoryKindLabels.note, icon: FiBookOpen },
  { value: "milestone", label: memoryKindLabels.milestone, icon: FiStar },
];

const dateRangeFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
});

export default function TimelinePage() {
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState<TimelineFilter>("all");
  const [query, setQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("newest");
  const { memories, addMemory, deleteMemory } = useMemories();

  const filteredMemories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...memories]
      .filter((memory) => filter === "all" || memory.kind === filter)
      .filter(
        (memory) =>
          !normalizedQuery ||
          memory.title.toLowerCase().includes(normalizedQuery) ||
          memory.description.toLowerCase().includes(normalizedQuery),
      )
      .sort((a, b) =>
        sortDirection === "newest"
          ? b.date.localeCompare(a.date)
          : a.date.localeCompare(b.date),
      );
  }, [filter, memories, query, sortDirection]);

  const groups = useMemo(
    () =>
      filteredMemories.reduce<Record<string, typeof filteredMemories>>(
        (result, memory) => {
          const year = memory.date.slice(0, 4);
          (result[year] ??= []).push(memory);
          return result;
        },
        {},
      ),
    [filteredMemories],
  );

  const years = Object.keys(groups);
  const datedMemories = memories.filter((memory) => memory.date);
  const oldestDate = datedMemories.length
    ? [...datedMemories].sort((a, b) => a.date.localeCompare(b.date))[0].date
    : null;
  const newestDate = datedMemories.length
    ? [...datedMemories].sort((a, b) => b.date.localeCompare(a.date))[0].date
    : null;
  const dateRange = oldestDate && newestDate
    ? `${dateRangeFormatter.format(new Date(`${oldestDate}T12:00:00`))} — ${dateRangeFormatter.format(new Date(`${newestDate}T12:00:00`))}`
    : "Your story starts today";

  function countForFilter(value: TimelineFilter) {
    return value === "all"
      ? memories.length
      : memories.filter((memory) => memory.kind === value).length;
  }

  const hasActiveSearch = Boolean(query.trim()) || filter !== "all";

  return (
    <NestShell onAdd={() => setAdding(true)}>
      <main className="mx-auto max-w-7xl px-5 pb-28 pt-8 sm:px-8 lg:px-12 lg:pb-16 lg:pt-12">
        <section className="overflow-hidden rounded-[34px] border border-primary/10 bg-surface-strong p-6 shadow-lg sm:p-9">
          <div className="flex flex-col justify-between gap-7 xl:flex-row xl:items-end">
            <div className="max-w-3xl">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.17em] text-muted">
                <FiCalendar aria-hidden="true" />
                Every chapter, together
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-[-0.06em] sm:text-6xl">
                Family timeline
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                Revisit the photos, firsts and little stories that make your family yours.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAdding(true)}
              className="flex self-start items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-md transition hover:-translate-y-0.5 hover:bg-primary-hover"
            >
              <FiPlus aria-hidden="true" />
              Add memory
            </button>
          </div>

          <div className="mt-8 grid gap-3 border-t border-primary/10 pt-6 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Saved moments</p>
              <p className="mt-2 text-2xl font-bold">{memories.length}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Years collected</p>
              <p className="mt-2 text-2xl font-bold">{new Set(memories.map((memory) => memory.date.slice(0, 4))).size}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Date range</p>
              <p className="mt-2 text-base font-bold sm:text-lg">{dateRange}</p>
            </div>
          </div>
        </section>

        <section className="sticky top-20 z-10 -mx-2 mt-6 rounded-[28px] border border-primary/10 bg-background/90 p-3 shadow-md backdrop-blur-xl sm:mx-0 sm:p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search memories</span>
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search memories..."
                className="w-full rounded-full border border-primary/10 bg-surface-strong py-3 pl-11 pr-10 text-sm outline-none transition placeholder:text-muted focus:border-primary/35"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-primary-soft"
                  aria-label="Clear search"
                >
                  <FiX aria-hidden="true" />
                </button>
              ) : null}
            </label>

            <div className="flex gap-2 overflow-x-auto pb-1 xl:pb-0">
              {filterOptions.map((option) => {
                const FilterIcon = option.icon;
                const active = filter === option.value;
                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary-soft/70 text-muted hover:text-primary"
                    }`}
                  >
                    <FilterIcon aria-hidden="true" />
                    {option.label}
                    <span className={active ? "text-primary-soft" : "text-muted"}>
                      {countForFilter(option.value)}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setSortDirection((current) => current === "newest" ? "oldest" : "newest")}
              className="flex shrink-0 items-center justify-center gap-2 rounded-full border border-primary/10 bg-surface-strong px-4 py-2.5 text-sm font-semibold"
            >
              {sortDirection === "newest" ? <FiArrowDown aria-hidden="true" /> : <FiArrowUp aria-hidden="true" />}
              {sortDirection === "newest" ? "Newest first" : "Oldest first"}
            </button>
          </div>
        </section>

        <div className="mt-10 grid gap-10 lg:grid-cols-[160px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-52">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Jump to year</p>
              <nav className="mt-4 space-y-2" aria-label="Timeline years">
                {years.map((year) => (
                  <a
                    key={year}
                    href={`#year-${year}`}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition hover:bg-primary-soft"
                  >
                    {year}
                    <span className="text-xs font-semibold text-muted">{groups[year].length}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="min-w-0 space-y-16">
            {Object.entries(groups).map(([year, yearMemories]) => (
              <section key={year} id={`year-${year}`} className="scroll-mt-52">
                <div className="mb-7 flex items-center gap-4">
                  <h2 className="text-4xl font-bold tracking-[-0.05em]">{year}</h2>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                    {yearMemories.length} {yearMemories.length === 1 ? "memory" : "memories"}
                  </span>
                  <div className="h-px flex-1 bg-primary/10" />
                </div>

                <div className="relative space-y-7 sm:before:absolute sm:before:bottom-0 sm:before:left-[37px] sm:before:top-0 sm:before:w-px sm:before:bg-primary/15">
                  {yearMemories.map((memory) => (
                    <TimelineMemoryItem key={memory.id} memory={memory} onDelete={deleteMemory} />
                  ))}
                </div>
              </section>
            ))}

            {!filteredMemories.length ? (
              <section className="rounded-[32px] border border-dashed border-primary/20 bg-surface p-10 text-center sm:p-16">
                <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-2xl">
                  <FiSearch aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-2xl font-bold">No memories found</h2>
                <p className="mx-auto mt-2 max-w-md leading-7 text-muted">
                  {hasActiveSearch
                    ? "Try another search or clear the filters to see your whole family story."
                    : "Add your first memory and begin your family timeline."}
                </p>
                {hasActiveSearch ? (
                  <button
                    type="button"
                    onClick={() => { setQuery(""); setFilter("all"); }}
                    className="mt-6 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
                  >
                    Clear filters
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAdding(true)}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
                  >
                    <FiPlus aria-hidden="true" />
                    Add first memory
                  </button>
                )}
              </section>
            ) : null}
          </div>
        </div>
      </main>

      <AddMemoryModal open={adding} onClose={() => setAdding(false)} onAdd={addMemory} />
    </NestShell>
  );
}
