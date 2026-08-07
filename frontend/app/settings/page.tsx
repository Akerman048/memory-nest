import type { Metadata } from "next";
import { FiSettings } from "react-icons/fi";

import { NestShell } from "../nest/nest-shell";
import { AccountSettingsForm } from "./settings-form";

export const metadata: Metadata = {
  title: "Account settings | Memory Nest",
  description: "Update your Memory Nest account details and family role.",
};

export default function SettingsPage() {
  return (
    <NestShell>
      <main className="mx-auto max-w-5xl px-5 pb-28 pt-8 sm:px-8 lg:px-12 lg:pb-12 lg:pt-12">
        <div className="flex items-start gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-2xl shadow-sm">
            <FiSettings aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.17em] text-muted">Your account</p>
            <h1 className="mt-1 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">Profile settings</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Keep your personal details current so your family always knows who is sharing each memory.
            </p>
          </div>
        </div>

        <AccountSettingsForm />
      </main>
    </NestShell>
  );
}
