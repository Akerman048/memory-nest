"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type JourneyStage = "BORN" | "EXPECTED";

export function ChildProfileForm() {
  const today = new Date().toISOString().slice(0, 10);
  const [journeyStage, setJourneyStage] = useState<JourneyStage>("BORN");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdName, setCreatedName] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const date = String(form.get("date") ?? "") || null;
    const payload = {
      name,
      birthDate: journeyStage === "BORN" ? date : null,
      expectedBirthDate: journeyStage === "EXPECTED" ? date : null,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
      const response = await fetch(`${apiUrl}/api/children`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const responsePayload = await response.json();

      if (!response.ok) {
        throw new Error(responsePayload?.error?.message ?? "We could not create the profile.");
      }

      setCreatedName(responsePayload.data.name);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "We could not create the profile.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (createdName) {
    return (
      <div className="mx-auto mt-10 max-w-xl rounded-[28px] border border-primary/10 bg-white/65 p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent text-2xl">✓</span>
        <h2 className="mt-5 text-2xl font-bold">{createdName}&apos;s nest is ready!</h2>
        <p className="mt-3 leading-7 text-muted">You can now begin adding the moments that matter most.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-primary px-7 py-3.5 font-semibold text-white transition hover:bg-primary-hover">
          Go to my nest
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-xl space-y-6">
      <fieldset>
        <legend className="text-sm font-semibold">Where are you in the journey?</legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {([
            { value: "BORN", label: "Already born", hint: "Add their birthday" },
            { value: "EXPECTED", label: "On the way", hint: "Add an expected date" },
          ] as const).map((option) => (
            <label key={option.value} className={`cursor-pointer rounded-[22px] border p-4 transition ${journeyStage === option.value ? "border-primary bg-primary text-white shadow-md" : "border-primary/12 bg-white/50 hover:bg-white/80"}`}>
              <input type="radio" name="journeyStage" value={option.value} checked={journeyStage === option.value} onChange={() => setJourneyStage(option.value)} className="sr-only" />
              <span className="block font-bold">{option.label}</span>
              <span className={`mt-1 block text-sm ${journeyStage === option.value ? "text-white/70" : "text-muted"}`}>{option.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="text-sm font-semibold">Child&apos;s name or nickname</span>
        <input name="name" type="text" minLength={1} maxLength={80} required placeholder={journeyStage === "EXPECTED" ? "Baby Morgan" : "Olivia"} className="mt-2 w-full rounded-2xl border border-primary/15 bg-white/60 px-4 py-3.5 outline-none transition placeholder:text-primary/30 focus:border-primary/45 focus:bg-white" />
      </label>

      <label className="block">
        <span className="text-sm font-semibold">{journeyStage === "BORN" ? "Date of birth" : "Expected arrival date"}</span>
        <input name="date" type="date" min={journeyStage === "EXPECTED" ? today : undefined} max={journeyStage === "BORN" ? today : undefined} required className="mt-2 w-full rounded-2xl border border-primary/15 bg-white/60 px-4 py-3.5 outline-none transition focus:border-primary/45 focus:bg-white" />
      </label>

      {error ? <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center rounded-full bg-primary px-7 py-4 font-semibold text-white shadow-[0_14px_36px_rgba(15,60,101,0.2)] transition hover:-translate-y-0.5 hover:bg-primary-hover disabled:cursor-wait disabled:opacity-60">
        {isSubmitting ? "Creating the profile..." : "Create child profile"}
      </button>
      <p className="text-center text-sm text-muted">You can change these details later.</p>
    </form>
  );
}
