import type { Metadata } from "next";
import Link from "next/link";

import { VerifyEmailForm } from "./verify-email-form";

export const metadata: Metadata = {
  title: "Verify your email | Memory Nest",
};

type VerifyEmailPageProps = {
  searchParams: Promise<{ token?: string; email?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { token = "", email = "" } = await searchParams;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute -left-32 top-1/3 size-96 rounded-full bg-accent/80 blur-[90px]" />
      <div className="pointer-events-none absolute -right-36 top-0 size-[500px] rounded-full bg-primary-soft blur-[100px]" />
      <section className="glass-strong relative z-10 w-full max-w-lg rounded-[34px] p-7 sm:p-10">
        <Link href="/" className="font-bold">⌁ Memory Nest</Link>
        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.17em] text-muted">One secure step</p>
        <h1 className="mt-2 text-4xl font-bold tracking-[-0.05em]">Verify your email</h1>
        <p className="mt-4 leading-7 text-muted">Confirm your email address before opening your private family nest.</p>
        <VerifyEmailForm token={token} initialEmail={email} />
      </section>
    </main>
  );
}
