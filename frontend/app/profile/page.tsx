import type { Metadata } from "next";
import Link from "next/link";

import { ChildProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "Create a child profile | Memory Nest",
  description: "Create the first child profile in your private family nest.",
};

export default function ProfilePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6 sm:py-12">
      <div className="pointer-events-none absolute -left-32 top-1/4 size-[430px] rounded-full bg-accent/80 blur-[100px]" />
      <div className="pointer-events-none absolute -right-36 bottom-0 size-[520px] rounded-full bg-primary-soft blur-[110px]" />

      <div className="glass-strong relative z-10 w-full max-w-3xl rounded-[36px] p-6 sm:p-10 lg:p-12">
        <div className="flex items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-3 font-bold">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-2xl">⌁</span>
            <span className="text-xl tracking-[-0.03em]">Memory Nest</span>
          </Link>
          <span className="rounded-full border border-primary/10 bg-white/50 px-4 py-2 text-sm font-semibold text-muted">
            Step 2 of 2
          </span>
        </div>

        <div className="mx-auto mt-10 max-w-xl text-center">
          <span className="mx-auto flex size-20 items-center justify-center rounded-[28px] bg-accent text-4xl shadow-sm">♡</span>
          <h1 className="mt-6 text-4xl font-bold tracking-[-0.055em] sm:text-5xl">Who is this nest for?</h1>
          <p className="mt-4 text-lg leading-8 text-muted">
            Start with a few details. You can add photos, milestones and stories after the profile is created.
          </p>
        </div>

        <ChildProfileForm />
      </div>
    </main>
  );
}
