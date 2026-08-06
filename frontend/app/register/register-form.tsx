"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const roles = [
  { value: "PARENT", label: "Parent", description: "Mum, dad or parent" },
  { value: "GUARDIAN", label: "Guardian", description: "Legal guardian or carer" },
  { value: "FAMILY_MEMBER", label: "Family", description: "Grandparent or relative" },
  { value: "OTHER", label: "Other", description: "Another trusted person" },
] as const;

type AccountRole = (typeof roles)[number]["value"];
type AuthMode = "register" | "login";

type AuthFormProps = {
  initialMode?: AuthMode;
};

export function AuthForm({ initialMode = "register" }: AuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
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

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
      const response = await fetch(`${apiUrl}/api/auth/${mode}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "register"
            ? { name, email, password, accountRole }
            : { email, password },
        ),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error?.message ?? "We could not create your account.");
      }

      router.push(mode === "register" ? "/profile" : "/dashboard");
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

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
    router.replace(nextMode === "login" ? "/register?mode=login" : "/register", {
      scroll: false,
    });
  }

  return (
    <div className="mt-3">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
          {mode === "register" ? "Step 1 of 2" : "Welcome back"}
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-[-0.045em] sm:text-4xl">
          {mode === "register" ? "Create your account" : "Log in to your nest"}
        </h2>
        <p className="mt-3 leading-7 text-muted">
          {mode === "register"
            ? "First, tell us who is creating this family nest."
            : "Continue collecting the moments that matter most."}
        </p>
      </div>

      <div className="mt-7 grid grid-cols-2 rounded-full bg-primary/5 p-1">
        <button type="button" onClick={() => switchMode("register")} className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${mode === "register" ? "bg-white text-primary shadow-sm" : "text-muted hover:text-primary"}`}>
          Create account
        </button>
        <button type="button" onClick={() => switchMode("login")} className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${mode === "login" ? "bg-white text-primary shadow-sm" : "text-muted hover:text-primary"}`}>
          Log in
        </button>
      </div>

      <form className="mt-7 space-y-6" onSubmit={handleSubmit}>
      {mode === "register" ? <fieldset>
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
      </fieldset> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        {mode === "register" ? (
        <label className="sm:col-span-2">
          <span className="text-sm font-semibold">Your name</span>
          <input name="name" type="text" autoComplete="name" minLength={2} maxLength={80} required placeholder="Alex Morgan" className="mt-2 w-full rounded-2xl border border-primary/15 bg-white/60 px-4 py-3.5 outline-none transition placeholder:text-primary/30 focus:border-primary/45 focus:bg-white" />
        </label>
        ) : null}

        <label className="sm:col-span-2">
          <span className="text-sm font-semibold">Email address</span>
          <input name="email" type="email" autoComplete="email" required placeholder="alex@example.com" className="mt-2 w-full rounded-2xl border border-primary/15 bg-white/60 px-4 py-3.5 outline-none transition placeholder:text-primary/30 focus:border-primary/45 focus:bg-white" />
        </label>

        <label className={mode === "login" ? "sm:col-span-2" : undefined}>
          <span className="text-sm font-semibold">Password</span>
          <input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={mode === "register" ? 8 : 1} maxLength={128} required placeholder={mode === "login" ? "Your password" : "At least 8 characters"} className="mt-2 w-full rounded-2xl border border-primary/15 bg-white/60 px-4 py-3.5 outline-none transition placeholder:text-primary/30 focus:border-primary/45 focus:bg-white" />
        </label>

        {mode === "register" ? (
        <label>
          <span className="text-sm font-semibold">Confirm password</span>
          <input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={128} required placeholder="Repeat your password" className="mt-2 w-full rounded-2xl border border-primary/15 bg-white/60 px-4 py-3.5 outline-none transition placeholder:text-primary/30 focus:border-primary/45 focus:bg-white" />
        </label>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {mode === "register" ? <label className="flex items-start gap-3 text-sm leading-6 text-muted">
        <input type="checkbox" required className="mt-1 size-4 accent-primary" />
        <span>I agree to the Terms of Service and Privacy Policy.</span>
      </label> : null}

      <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center rounded-full bg-primary px-7 py-4 font-semibold text-white shadow-[0_14px_36px_rgba(15,60,101,0.2)] transition hover:-translate-y-0.5 hover:bg-primary-hover disabled:cursor-wait disabled:opacity-60">
        {isSubmitting
          ? mode === "register" ? "Creating your account..." : "Logging in..."
          : mode === "register" ? "Create my account" : "Log in"}
      </button>

      <p className="text-center text-sm text-muted">
        {mode === "register" ? "Already have an account? " : "New to Memory Nest? "}
        <button type="button" onClick={() => switchMode(mode === "register" ? "login" : "register")} className="font-semibold text-primary hover:underline">
          {mode === "register" ? "Log in" : "Create an account"}
        </button>
      </p>
      </form>
    </div>
  );
}
