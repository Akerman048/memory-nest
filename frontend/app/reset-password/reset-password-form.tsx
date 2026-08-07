"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function ResetPasswordForm({ token }: { token: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(token ? "" : "This password reset link is incomplete.");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirmation") ?? "");

    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error?.message ?? "We could not reset your password.");
      }

      setSuccess(true);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "We could not reset your password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return <div className="mt-8 rounded-[24px] bg-primary-soft p-5"><p className="flex items-center gap-2 font-semibold"><FiCheckCircle aria-hidden="true" />Password updated</p><Link href="/register?mode=login" className="mt-4 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">Continue to login</Link></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <label className="block"><span className="text-sm font-semibold">New password</span><input name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required className="mt-2 w-full rounded-2xl border border-primary/15 bg-white/60 px-4 py-3.5 outline-none focus:border-primary/45" /></label>
      <label className="block"><span className="text-sm font-semibold">Confirm new password</span><input name="confirmation" type="password" autoComplete="new-password" minLength={8} maxLength={128} required className="mt-2 w-full rounded-2xl border border-primary/15 bg-white/60 px-4 py-3.5 outline-none focus:border-primary/45" /></label>
      {error ? <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <button disabled={isSubmitting || !token} className="w-full rounded-full bg-primary px-6 py-4 font-semibold text-white disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Updating..." : "Set new password"}</button>
    </form>
  );
}
