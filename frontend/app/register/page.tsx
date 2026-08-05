import type { Metadata } from "next";
import Link from "next/link";

import { AuthForm } from "./register-form";

export const metadata: Metadata = {
  title: "Create your account | Memory Nest",
  description: "Create a private Memory Nest account for your family.",
};

type RegisterPageProps = {
  searchParams: Promise<{ mode?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { mode } = await searchParams;
  const initialMode = mode === "login" ? "login" : "register";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6 sm:py-12">
      <div className="pointer-events-none absolute -left-32 top-1/3 size-96 rounded-full bg-accent/80 blur-[90px]" />
      <div className="pointer-events-none absolute -right-36 top-0 size-[500px] rounded-full bg-primary-soft blur-[100px]" />

      <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[36px] border border-white/90 bg-white/55 shadow-[0_30px_100px_rgba(15,60,101,0.16)] backdrop-blur-[32px] lg:grid-cols-[0.82fr_1.18fr]">
        <section className="flex flex-col justify-between bg-primary p-7 text-white sm:p-10 lg:p-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 font-bold">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-2xl text-primary">
                ⌁
              </span>
              <span className="text-xl tracking-[-0.03em]">Memory Nest</span>
            </Link>

            <p className="mt-16 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
              Your private family space
            </p>
            <h1 className="mt-4 max-w-sm text-4xl font-bold leading-tight tracking-[-0.05em] sm:text-5xl">
              Begin preserving your family story.
            </h1>
            <p className="mt-6 max-w-sm text-base leading-7 text-white/72">
              Create an account now. You can add a child profile, invite loved ones and start collecting memories next.
            </p>
          </div>

          <div className="mt-14 rounded-[24px] border border-white/15 bg-white/10 p-5 text-sm leading-6 text-white/75">
            Your photos, stories and milestones stay private and belong to your family.
          </div>
        </section>

        <section className="p-6 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-xl">
            <div className="flex justify-end">
              <Link href="/" className="rounded-full border border-primary/15 px-4 py-2 text-sm font-semibold hover:bg-white/70">
                Back
              </Link>
            </div>

            <AuthForm initialMode={initialMode} />
          </div>
        </section>
      </div>
    </main>
  );
}
