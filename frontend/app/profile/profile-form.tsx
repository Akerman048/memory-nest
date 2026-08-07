"use client";

import { FormEvent, useEffect, useState } from "react";
import { FiCheckCircle, FiSave } from "react-icons/fi";
import { useRouter } from "next/navigation";

type JourneyStage = "BORN" | "EXPECTED";

type ChildProfile = {
  id: number;
  name: string;
  birthDate: string | null;
  expectedBirthDate: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const dateValue = (value: string | null) => value?.slice(0, 10) ?? "";

export function ChildProfileForm() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [journeyStage, setJourneyStage] = useState<JourneyStage>("BORN");
  const [profile, setProfile] = useState<ChildProfile>();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const response = await fetch(`${API_URL}/api/children`, {
          credentials: "include",
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error?.message ?? "We could not load the profile.");
        }

        const savedProfile = payload.data?.[0] as ChildProfile | undefined;
        if (!active || !savedProfile) return;

        const savedStage: JourneyStage = savedProfile.expectedBirthDate ? "EXPECTED" : "BORN";
        setProfile(savedProfile);
        setName(savedProfile.name);
        setJourneyStage(savedStage);
        setDate(dateValue(savedStage === "BORN" ? savedProfile.birthDate : savedProfile.expectedBirthDate));
      } catch (caughtError) {
        if (active) {
          setError(caughtError instanceof Error ? caughtError.message : "We could not load the profile.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadProfile();
    return () => { active = false; };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const normalizedName = String(form.get("name") ?? "").trim();
    const normalizedDate = String(form.get("date") ?? "") || null;
    const payload = {
      name: normalizedName,
      birthDate: journeyStage === "BORN" ? normalizedDate : null,
      expectedBirthDate: journeyStage === "EXPECTED" ? normalizedDate : null,
    };

    try {
      const response = await fetch(
        profile ? `${API_URL}/api/children/${profile.id}` : `${API_URL}/api/children`,
        {
          method: profile ? "PATCH" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const responsePayload = await response.json();

      if (!response.ok) {
        throw new Error(responsePayload?.error?.message ?? "We could not save the profile.");
      }

      const savedProfile = responsePayload.data as ChildProfile;
      const savedStage: JourneyStage = savedProfile.expectedBirthDate ? "EXPECTED" : "BORN";
      setProfile(savedProfile);
      setName(savedProfile.name);
      setJourneyStage(savedStage);
      setDate(dateValue(savedStage === "BORN" ? savedProfile.birthDate : savedProfile.expectedBirthDate));
      setSuccess(profile ? "Profile changes saved." : "Child profile created and saved.");
      router.replace("/dashboard");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "We could not save the profile.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto mt-10 max-w-xl space-y-4" aria-label="Loading profile">
        <div className="h-20 animate-pulse rounded-[22px] bg-primary-soft/70" />
        <div className="h-14 animate-pulse rounded-2xl bg-primary-soft/70" />
        <div className="h-14 animate-pulse rounded-2xl bg-primary-soft/70" />
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
              <input type="radio" name="journeyStage" value={option.value} checked={journeyStage === option.value} onChange={() => { setJourneyStage(option.value); setDate(""); setSuccess(""); }} className="sr-only" />
              <span className="block font-bold">{option.label}</span>
              <span className={`mt-1 block text-sm ${journeyStage === option.value ? "text-white/70" : "text-muted"}`}>{option.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="text-sm font-semibold">Child&apos;s name or nickname</span>
        <input name="name" value={name} onChange={(event) => { setName(event.target.value); setSuccess(""); }} type="text" minLength={1} maxLength={80} required placeholder={journeyStage === "EXPECTED" ? "Baby Morgan" : "Olivia"} className="mt-2 w-full rounded-2xl border border-primary/15 bg-white/60 px-4 py-3.5 outline-none transition placeholder:text-primary/30 focus:border-primary/45 focus:bg-white" />
      </label>

      <label className="block">
        <span className="text-sm font-semibold">{journeyStage === "BORN" ? "Date of birth" : "Expected arrival date"}</span>
        <input name="date" value={date} onChange={(event) => { setDate(event.target.value); setSuccess(""); }} type="date" min={journeyStage === "EXPECTED" ? today : undefined} max={journeyStage === "BORN" ? today : undefined} required className="mt-2 w-full rounded-2xl border border-primary/15 bg-white/60 px-4 py-3.5 outline-none transition focus:border-primary/45 focus:bg-white" />
      </label>

      {error ? <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {success ? <p role="status" className="flex items-center gap-2 rounded-2xl border border-primary/10 bg-primary-soft px-4 py-3 text-sm font-semibold text-primary"><FiCheckCircle aria-hidden="true" />{success}</p> : null}

      <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center rounded-full bg-primary px-7 py-4 font-semibold text-white shadow-[0_14px_36px_rgba(15,60,101,0.2)] transition hover:-translate-y-0.5 hover:bg-primary-hover disabled:cursor-wait disabled:opacity-60">
        {!isSubmitting ? <FiSave className="mr-2" aria-hidden="true" /> : null}
        {isSubmitting ? "Saving profile..." : profile ? "Save changes" : "Create child profile"}
      </button>
      <p className="text-center text-sm text-muted">Changes are saved securely to your family nest.</p>
    </form>
  );
}
