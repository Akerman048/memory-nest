import type { Metadata } from "next";
import Link from "next/link";

import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Choose a new password | Memory Nest",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token = "" } = await searchParams;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute -left-32 top-1/3 size-96 rounded-full bg-accent/80 blur-[90px]" />
      <section className="glass-strong relative z-10 w-full max-w-lg rounded-[34px] p-7 sm:p-10">
        <Link href="/register?mode=login" className="text-sm font-semibold hover:underline">← Back to login</Link>
        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.17em] text-muted">Account recovery</p>
        <h1 className="mt-2 text-4xl font-bold tracking-[-0.05em]">Choose a new password</h1>
        <p className="mt-4 leading-7 text-muted">Use at least eight characters and choose a password you do not use elsewhere.</p>
        <ResetPasswordForm token={token} />
      </section>
    </main>
  );
}
