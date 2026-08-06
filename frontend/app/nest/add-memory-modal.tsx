"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

import { memoryKindIcons } from "./memory-icons";
import { MemoryKind, memoryKindLabels, NewMemoryInput } from "./types";

const kinds = Object.keys(memoryKindLabels) as MemoryKind[];

export function AddMemoryModal({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (memory: NewMemoryInput) => Promise<void> }) {
  const [kind, setKind] = useState<MemoryKind>("photo");
  const [file, setFile] = useState<File>();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (!open) return null;

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setError("");
    if (!file) return;
    const maxBytes = kind === "photo" ? 25 * 1024 * 1024 : 250 * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`${kind === "photo" ? "Photos" : "Videos"} must be ${kind === "photo" ? "25" : "250"} MB or smaller.`);
      event.target.value = "";
      return;
    }
    setFile(file);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      await onAdd({
        kind,
        title: String(form.get("title") ?? "").trim(),
        description: String(form.get("description") ?? "").trim(),
        date: String(form.get("date")),
        ...(file ? { file } : {}),
      });
      setFile(undefined);
      onClose();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not save this memory.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-primary/35 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="add-memory-title">
      <button className="absolute inset-0" onClick={onClose} aria-label="Close dialog" />
      <form onSubmit={submit} className="relative max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-[32px] bg-background p-6 shadow-2xl sm:rounded-[32px] sm:p-8">
        <div className="flex items-start justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">A new chapter</p><h2 id="add-memory-title" className="mt-2 text-3xl font-bold tracking-[-0.04em]">Add a memory</h2></div><button type="button" onClick={onClose} className="flex size-10 items-center justify-center rounded-full bg-primary-soft text-xl" aria-label="Close"><FiX aria-hidden="true" /></button></div>
        <div className="mt-7 grid grid-cols-4 gap-2">
          {kinds.map((item) => { const KindIcon = memoryKindIcons[item]; return <button type="button" key={item} onClick={() => { setKind(item); setFile(undefined); setError(""); }} className={`rounded-2xl px-2 py-3 text-xs font-semibold transition sm:text-sm ${kind === item ? "bg-primary text-primary-foreground" : "bg-primary-soft text-muted"}`}><KindIcon className="mx-auto mb-1 text-xl" aria-hidden="true" />{memoryKindLabels[item]}</button>; })}
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="sm:col-span-2"><span className="text-sm font-semibold">Title</span><input name="title" required maxLength={100} placeholder="A moment worth remembering" className="mt-2 w-full rounded-2xl border border-primary/15 bg-surface-strong px-4 py-3.5 outline-none focus:border-primary/40" /></label>
          <label><span className="text-sm font-semibold">Date</span><input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className="mt-2 w-full rounded-2xl border border-primary/15 bg-surface-strong px-4 py-3.5 outline-none" /></label>
          {(kind === "photo" || kind === "video") ? <label><span className="text-sm font-semibold">{kind === "photo" ? "Photo" : "Video"}</span><input onChange={handleFile} type="file" accept={kind === "photo" ? "image/*" : "video/*"} required className="mt-2 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary-soft file:px-4 file:py-3 file:font-semibold" /></label> : <div />}
          <label className="sm:col-span-2"><span className="text-sm font-semibold">Story or note</span><textarea name="description" rows={4} maxLength={1000} placeholder="What made this moment special?" className="mt-2 w-full resize-none rounded-2xl border border-primary/15 bg-surface-strong px-4 py-3.5 outline-none focus:border-primary/40" /></label>
        </div>
        {error ? <p role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        <div className="mt-7 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-full px-5 py-3 font-semibold text-muted">Cancel</button><button disabled={isSubmitting || Boolean(error)} className="flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground hover:bg-primary-hover disabled:cursor-wait disabled:opacity-50"><FiPlus aria-hidden="true" />{isSubmitting ? "Uploading..." : "Save memory"}</button></div>
      </form>
    </div>
  );
}
