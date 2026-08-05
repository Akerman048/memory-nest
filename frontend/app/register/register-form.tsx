"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const roles = [
  { value: "PARENT", label: "Parent", description: "Mum, dad or parent" },
  { value: "GUARDIAN", label: "Guardian", description: "Legal guardian or carer" },
  { value: "FAMILY_MEMBER", label: "Family", description: "Grandparent or relative" },
  { value: "OTHER", label: "Other", description: "Another trusted person" },
] as const;

type AccountRole = (typeof roles)[number]["value"];

export function RegisterForm() {
  const router = useRouter();
  const [accountRole, setAccountRole] = useState<AccountRole>("PARENT");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, accountRole }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error?.message ?? "We could not create your account.");
      }

      router.push("/profile");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "We could not create your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-9 space-y-6" onSubmit={handleSubmit}>
      <fieldset>
        <legend className="text-sm font-semibold">I am a...</legend>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {roles.map((role) => (
            <label
              key={role.value}
              className={`cursor-pointer rounded-[20px] border p-3 transition ${
                accountRole === role.value
                  ? "border-primary bg-primary text-white shadow-md"
                  : "border-primary/12 bg-white/45 hover:bg-white/80"
              }`}
            >
              <input
                type="radio"
                name="accountRole"
                value={role.value}
                checked={accountRole === role.value}
                onChange={() => setAccountRole(role.value)}
                className="sr-only"
              />
              <span className="block text-sm font-bold">{role.label}</span>
              <span className={`mt-1 block text-xs leading-4 ${accountRole === role.value ? "text-white/70" : "text-muted"}`}>
                {role.description}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="text-sm font-semibold">Your name</span>
          <input name="name" type="text" autoComplete="name" minLength={2} maxLength={80} required placeholder="Alex Morgan" className="mt-2 w-full rounded-2xl border border-primary/15 bg-white/60 px-4 py-3.5 outline-none transition placeholder:text-primary/30 focus:border-primary/45 focus:bg-white" />
        </label>

        <label className="sm:col-span-2">
          <span className="text-sm font-semibold">Email address</span>
          <input name="email" type="email" autoComplete="email" required placeholder="alex@example.com" className="mt-2 w-full rounded-2xl border border-primary/15 bg-white/60 px-4 py-3.5 outline-none transition placeholder:text-primary/30 focus:border-primary/45 focus:bg-white" />
        </label>

        <label>
          <span className="text-sm font-semibold">Password</span>
          <input name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required placeholder="At least 8 characters" className="mt-2 w-full rounded-2xl border border-primary/15 bg-white/60 px-4 py-3.5 outline-none transition placeholder:text-primary/30 focus:border-primary/45 focus:bg-white" />
        </label>

        <label>
          <span className="text-sm font-semibold">Confirm password</span>
          <input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={128} required placeholder="Repeat your password" className="mt-2 w-full rounded-2xl border border-primary/15 bg-white/60 px-4 py-3.5 outline-none transition placeholder:text-primary/30 focus:border-primary/45 focus:bg-white" />
        </label>
      </div>

      {error ? (
        <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <label className="flex items-start gap-3 text-sm leading-6 text-muted">
        <input type="checkbox" required className="mt-1 size-4 accent-primary" />
        <span>I agree to the Terms of Service and Privacy Policy.</span>
      </label>

      <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center rounded-full bg-primary px-7 py-4 font-semibold text-white shadow-[0_14px_36px_rgba(15,60,101,0.2)] transition hover:-translate-y-0.5 hover:bg-primary-hover disabled:cursor-wait disabled:opacity-60">
        {isSubmitting ? "Creating your account..." : "Create my account"}
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account? <Link href="/login" className="font-semibold text-primary hover:underline">Log in</Link>
      </p>
    </form>
  );
}
