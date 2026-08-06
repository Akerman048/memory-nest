"use client";

import { ChangeEvent, FormEvent, useState } from "react";

import { Memory, MemoryKind, memoryKindIcons, memoryKindLabels } from "./types";

const kinds = Object.keys(memoryKindLabels) as MemoryKind[];

export function AddMemoryModal({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (memory: Memory) => void }) {
  const [kind, setKind] = useState<MemoryKind>("photo");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaName, setMediaName] = useState("");
  const [error, setError] = useState("");
  if (!open) return null;

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setError("");
    if (!file) return;
    if (file.size > 3_000_000) {
      setError("For this local preview, choose a file smaller than 3 MB.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { setMediaUrl(String(reader.result)); setMediaName(file.name); };
    reader.readAsDataURL(file);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onAdd({
      id: crypto.randomUUID(),
      kind,
      title: String(form.get("title") ?? "").trim(),
      description: String(form.get("description") ?? "").trim(),
      date: String(form.get("date")),
      mediaUrl: mediaUrl || undefined,
      mediaName: mediaName || undefined,
      createdAt: new Date().toISOString(),
    });
    setMediaUrl(""); setMediaName(""); setError(""); onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#173d3b]/35 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="add-memory-title">
      <button className="absolute inset-0" onClick={onClose} aria-label="Close dialog" />
      <form onSubmit={submit} className="relative max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-[32px] bg-[#fbfaf6] p-6 shadow-2xl sm:rounded-[32px] sm:p-8">
        <div className="flex items-start justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#788984]">A new chapter</p><h2 id="add-memory-title" className="mt-2 text-3xl font-bold tracking-[-0.04em]">Add a memory</h2></div><button type="button" onClick={onClose} className="flex size-10 items-center justify-center rounded-full bg-[#edf1ec] text-xl">×</button></div>
        <div className="mt-7 grid grid-cols-4 gap-2">
          {kinds.map((item) => <button type="button" key={item} onClick={() => { setKind(item); setMediaUrl(""); setMediaName(""); }} className={`rounded-2xl px-2 py-3 text-xs font-semibold transition sm:text-sm ${kind === item ? "bg-[#173d3b] text-white" : "bg-[#edf1ec] text-[#61726f]"}`}><span className="mb-1 block text-xl">{memoryKindIcons[item]}</span>{memoryKindLabels[item]}</button>)}
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="sm:col-span-2"><span className="text-sm font-semibold">Title</span><input name="title" required maxLength={100} placeholder="A moment worth remembering" className="mt-2 w-full rounded-2xl border border-[#173d3b]/12 bg-white px-4 py-3.5 outline-none focus:border-[#173d3b]/40" /></label>
          <label><span className="text-sm font-semibold">Date</span><input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className="mt-2 w-full rounded-2xl border border-[#173d3b]/12 bg-white px-4 py-3.5 outline-none" /></label>
          {(kind === "photo" || kind === "video") ? <label><span className="text-sm font-semibold">{kind === "photo" ? "Photo" : "Video"}</span><input onChange={handleFile} type="file" accept={kind === "photo" ? "image/*" : "video/*"} required className="mt-2 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[#e7efe7] file:px-4 file:py-3 file:font-semibold" /></label> : <div />}
          <label className="sm:col-span-2"><span className="text-sm font-semibold">Story or note</span><textarea name="description" rows={4} maxLength={1000} placeholder="What made this moment special?" className="mt-2 w-full resize-none rounded-2xl border border-[#173d3b]/12 bg-white px-4 py-3.5 outline-none focus:border-[#173d3b]/40" /></label>
        </div>
        {error ? <p role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        <div className="mt-7 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-full px-5 py-3 font-semibold text-[#61726f]">Cancel</button><button disabled={Boolean(error)} className="rounded-full bg-[#173d3b] px-7 py-3 font-semibold text-white disabled:opacity-50">Save memory</button></div>
      </form>
    </div>
  );
}
