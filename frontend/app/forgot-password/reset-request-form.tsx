"use client";

import { FormEvent, useState } from "react";
import { FiCheckCircle, FiMail } from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: String(form.get("email") ?? "").trim() }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error?.message ?? "We could not request a reset link.");
      }

      setSuccess(payload.data?.message ?? "If the account exists, a reset link has been sent.");
      event.currentTarget.reset();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "We could not request a reset link.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <label className="block">
        <span className="text-sm font-semibold">Email address</span>
        <span className="relative mt-2 block">
          <FiMail aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input name="email" type="email" autoComplete="email" required placeholder="alex@example.com" className="w-full rounded-2xl border border-primary/15 bg-white/60 py-3.5 pl-11 pr-4 outline-none focus:border-primary/45 focus:bg-white" />
        </span>
      </label>
      {error ? <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {success ? <p role="status" className="flex gap-2 rounded-2xl bg-primary-soft px-4 py-3 text-sm font-semibold"><FiCheckCircle className="mt-0.5 shrink-0" aria-hidden="true" />{success}</p> : null}
      <button disabled={isSubmitting} className="w-full rounded-full bg-primary px-6 py-4 font-semibold text-white disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Sending..." : "Send reset link"}</button>
    </form>
  );
}
