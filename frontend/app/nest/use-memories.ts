"use client";

import { useCallback, useSyncExternalStore } from "react";

import { Memory, starterMemories } from "./types";

const STORAGE_KEY = "memory-nest:memories";
const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedMemories = starterMemories;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readMemories() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedMemories;
  cachedRaw = raw;
  try {
    cachedMemories = raw ? JSON.parse(raw) : starterMemories;
  } catch {
    cachedMemories = starterMemories;
  }
  return cachedMemories;
}

function persist(memories: Memory[]) {
  const raw = JSON.stringify(memories);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedMemories = memories;
  listeners.forEach((listener) => listener());
}

export function useMemories() {
  const memories = useSyncExternalStore(subscribe, readMemories, () => starterMemories);

  const addMemory = useCallback((memory: Memory) => {
    persist([memory, ...readMemories()]);
  }, []);

  const deleteMemory = useCallback((id: string) => {
    persist(readMemories().filter((memory) => memory.id !== id));
  }, []);

  return { memories, isReady: true, addMemory, deleteMemory };
}
