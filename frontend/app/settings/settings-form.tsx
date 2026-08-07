"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiLogOut, FiMail, FiSave, FiShield, FiUser } from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const roles = [
  { value: "PARENT", label: "Parent", description: "Mum, dad or parent" },
  { value: "GUARDIAN", label: "Guardian", description: "Legal guardian or carer" },
  { value: "FAMILY_MEMBER", label: "Family", description: "Grandparent or relative" },
  { value: "OTHER", label: "Other", description: "Another trusted person" },
] as const;

type AccountRole = (typeof roles)[number]["value"];

type UserProfile = {
  id: number;
  name: string;
  email: string;
  accountRole: AccountRole;
  createdAt: string;
};

export function AccountSettingsForm() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>();
  const [name, setName] = useState("");
  const [accountRole, setAccountRole] = useState<AccountRole>("PARENT");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
        });
        const payload = await response.json();

        if (response.status === 401) {
          router.replace("/register?mode=login");
          return;
        }

        if (!response.ok) {
          throw new Error(payload?.error?.message ?? "We could not load your account settings.");
        }

        const savedProfile = payload.data?.user as UserProfile;
        if (!active) return;

        setProfile(savedProfile);
        setName(savedProfile.name);
        setAccountRole(savedProfile.accountRole);
      } catch (caughtError) {
        if (active) {
          setError(caughtError instanceof Error ? caughtError.message : "We could not load your account settings.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadProfile();
    return () => { active = false; };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), accountRole }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error?.message ?? "We could not save your account settings.");
      }

      const savedProfile = payload.data?.user as UserProfile;
      setProfile(savedProfile);
      setName(savedProfile.name);
      setAccountRole(savedProfile.accountRole);
      setSuccess("Your profile settings have been saved.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "We could not save your account settings.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    setError("");
    setIsLoggingOut(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("We could not log you out. Please try again.");
      }

      router.replace("/register?mode=login");
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "We could not log you out.");
      setIsLoggingOut(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_18rem]" aria-label="Loading account settings">
        <div className="h-96 animate-pulse rounded-[30px] bg-primary-soft/70" />
        <div className="h-56 animate-pulse rounded-[30px] bg-primary-soft/70" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 grid items-start gap-6 lg:grid-cols-[1fr_18rem]">
      <section className="glass-strong rounded-[30px] p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-lg">
            <FiUser aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-xl font-bold">Personal details</h2>
            <p className="text-sm text-muted">The information shown to your family.</p>
          </div>
        </div>

        <div className="mt-7 space-y-6">
          <label className="block">
            <span className="text-sm font-semibold">Your name</span>
            <input name="name" value={name} onChange={(event) => { setName(event.target.value); setSuccess(""); }} type="text" autoComplete="name" minLength={2} maxLength={80} required className="mt-2 w-full rounded-2xl border border-primary/15 bg-white/60 px-4 py-3.5 outline-none transition focus:border-primary/45 focus:bg-white" />
          </label>

          <label className="block">
            <span className="text-sm font-semibold">Email address</span>
            <span className="relative mt-2 block">
              <FiMail aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input value={profile?.email ?? ""} type="email" readOnly className="w-full cursor-not-allowed rounded-2xl border border-primary/10 bg-primary/5 py-3.5 pl-11 pr-4 text-muted outline-none" />
            </span>
            <span className="mt-2 block text-xs text-muted">Your email is used to sign in and cannot be changed here.</span>
          </label>

          <fieldset>
            <legend className="text-sm font-semibold">Your role in the family</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {roles.map((role) => (
                <label key={role.value} className={`cursor-pointer rounded-[20px] border p-4 transition ${accountRole === role.value ? "border-primary bg-primary text-white shadow-md" : "border-primary/12 bg-white/45 hover:bg-white/80"}`}>
                  <input type="radio" name="accountRole" value={role.value} checked={accountRole === role.value} onChange={() => { setAccountRole(role.value); setSuccess(""); }} className="sr-only" />
                  <span className="block font-bold">{role.label}</span>
                  <span className={`mt-1 block text-sm ${accountRole === role.value ? "text-white/70" : "text-muted"}`}>{role.description}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {error ? <p role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        {success ? <p role="status" className="mt-6 flex items-center gap-2 rounded-2xl border border-primary/10 bg-primary-soft px-4 py-3 text-sm font-semibold"><FiCheckCircle aria-hidden="true" />{success}</p> : null}

        <button type="submit" disabled={isSubmitting || !profile} className="mt-7 flex w-full items-center justify-center rounded-full bg-primary px-7 py-4 font-semibold text-white shadow-[0_14px_36px_rgba(15,60,101,0.2)] transition hover:-translate-y-0.5 hover:bg-primary-hover disabled:cursor-wait disabled:opacity-60 sm:w-auto">
          {!isSubmitting ? <FiSave className="mr-2" aria-hidden="true" /> : null}
          {isSubmitting ? "Saving settings..." : "Save profile settings"}
        </button>
      </section>

      <aside className="rounded-[30px] bg-primary p-6 text-white shadow-xl">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-white/12 text-xl">
          <FiShield aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-xl font-bold">Private by design</h2>
        <p className="mt-3 text-sm leading-6 text-primary-soft">
          Your account details are only used to identify you inside your private family nest.
        </p>
        <button type="button" onClick={handleLogout} disabled={isLoggingOut} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-3 text-sm font-semibold transition hover:bg-white/10 disabled:cursor-wait disabled:opacity-60">
          <FiLogOut aria-hidden="true" />
          {isLoggingOut ? "Logging out..." : "Log out"}
        </button>
        {profile?.createdAt ? (
          <p className="mt-6 border-t border-white/15 pt-5 text-xs text-primary-soft">
            Member since {new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(profile.createdAt))}
          </p>
        ) : null}
      </aside>
    </form>
  );
}
