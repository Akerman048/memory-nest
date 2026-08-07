import type { Metadata } from "next";
import Link from "next/link";

import { ForgotPasswordForm } from "./reset-request-form";

export const metadata: Metadata = {
  title: "Reset password | Memory Nest",
  description: "Request a secure Memory Nest password reset link.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute -left-32 top-1/3 size-96 rounded-full bg-accent/80 blur-[90px]" />
      <div className="pointer-events-none absolute -right-36 top-0 size-[500px] rounded-full bg-primary-soft blur-[100px]" />
      <section className="glass-strong relative z-10 w-full max-w-lg rounded-[34px] p-7 sm:p-10">
        <Link href="/register?mode=login" className="text-sm font-semibold hover:underline">← Back to login</Link>
        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.17em] text-muted">Account recovery</p>
        <h1 className="mt-2 text-4xl font-bold tracking-[-0.05em]">Forgot your password?</h1>
        <p className="mt-4 leading-7 text-muted">Enter your email and we will send a secure reset link if an account exists.</p>
        <ForgotPasswordForm />
      </section>
    </main>
  );
}
