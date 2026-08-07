"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { FiCheckCircle, FiMail } from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function VerifyEmailForm({ token, initialEmail }: { token: string; initialEmail: string }) {
  const verificationStarted = useRef(false);
  const [isVerifying, setIsVerifying] = useState(Boolean(token));
  const [isSending, setIsSending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(token ? "" : "Check your inbox for a verification link.");

  useEffect(() => {
    if (!token || verificationStarted.current) return;
    verificationStarted.current = true;

    async function verify() {
      try {
        const response = await fetch(`${API_URL}/api/auth/verify-email`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error?.message ?? "We could not verify your email.");
        }

        setVerified(true);
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : "We could not verify your email.");
      } finally {
        setIsVerifying(false);
      }
    }

    void verify();
  }, [token]);

  async function resend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSending(true);
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: String(form.get("email") ?? "").trim() }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message ?? "We could not send a new link.");
      setMessage(payload.data?.message ?? "A new verification link has been sent.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "We could not send a new link.");
    } finally {
      setIsSending(false);
    }
  }

  if (isVerifying) return <p role="status" className="mt-8 rounded-2xl bg-primary-soft px-4 py-4 font-semibold">Verifying your email...</p>;

  if (verified) {
    return <div className="mt-8 rounded-[24px] bg-primary-soft p-5"><p className="flex items-center gap-2 font-semibold"><FiCheckCircle aria-hidden="true" />Email verified</p><p className="mt-2 text-sm text-muted">Your account is active and you are securely signed in.</p><Link href="/profile" className="mt-5 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">Create child profile</Link></div>;
  }

  return (
    <form onSubmit={resend} className="mt-8 space-y-5">
      <label className="block"><span className="text-sm font-semibold">Email address</span><span className="relative mt-2 block"><FiMail aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" /><input name="email" defaultValue={initialEmail} type="email" required className="w-full rounded-2xl border border-primary/15 bg-white/60 py-3.5 pl-11 pr-4 outline-none focus:border-primary/45" /></span></label>
      {message ? <p role="status" className="rounded-2xl bg-primary-soft px-4 py-3 text-sm font-semibold">{message}</p> : null}
      {error ? <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <button disabled={isSending} className="w-full rounded-full bg-primary px-6 py-4 font-semibold text-white disabled:cursor-wait disabled:opacity-60">{isSending ? "Sending..." : "Send a new verification link"}</button>
      <Link href="/register?mode=login" className="block text-center text-sm font-semibold hover:underline">Back to login</Link>
    </form>
  );
}
