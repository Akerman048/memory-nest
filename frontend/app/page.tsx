const memories = [
  {
    icon: "📷",
    title: "Photos and videos",
    description:
      "Keep your child’s most meaningful photos, videos and everyday moments together.",
  },
  {
    icon: "🌱",
    title: "Growth timeline",
    description:
      "Follow important milestones and see how your child grows through the years.",
  },
  {
    icon: "💌",
    title: "Stories and letters",
    description:
      "Write stories, memories and letters your child can discover in the future.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
          <a
            href="#"
            className="flex items-center gap-3 text-xl font-bold tracking-tight"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-accent text-xl">
              🪺
            </span>

            <span>Memory Nest</span>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a
              href="#features"
              className="transition-colors hover:text-muted"
            >
              Features
            </a>

            <a
              href="#about"
              className="transition-colors hover:text-muted"
            >
              About
            </a>

            <a
              href="/login"
              className="transition-colors hover:text-muted"
            >
              Log in
            </a>
          </nav>

          <a
            href="/register"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-dark"
          >
            Create a nest
          </a>
        </div>
      </header>

      <main>
        <section className="overflow-hidden">
          <div className="mx-auto grid min-h-[720px] w-full max-w-6xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
                <span>✨</span>
                A safe place for family memories
              </div>

              <h1 className="text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
                Keep every little moment{" "}
                <span className="relative inline-block">
                  close forever
                  <span className="absolute -bottom-2 left-0 -z-10 h-4 w-full rounded-full bg-accent" />
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-lg leading-8 text-muted">
                Memory Nest helps families collect photos, milestones, stories
                and letters in one private place built around their child.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="/register"
                  className="rounded-full bg-primary px-7 py-3.5 text-center font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-dark"
                >
                  Start your memory nest
                </a>

                <a
                  href="#features"
                  className="rounded-full border border-primary px-7 py-3.5 text-center font-semibold text-primary transition hover:bg-primary-light"
                >
                  See how it works
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
                <span>✓ Private by default</span>
                <span>✓ Made for families</span>
                <span>✓ Easy to organize</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -left-8 -top-8 size-40 rounded-full bg-accent blur-2xl" />
              <div className="absolute -bottom-10 -right-8 size-48 rounded-full bg-primary-light blur-3xl" />

              <div className="relative rounded-[2rem] border border-border bg-card p-5 shadow-xl shadow-primary/10">
                <div className="rounded-[1.5rem] bg-primary p-6 text-primary-foreground">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">Emma’s Memory Nest</p>
                      <h2 className="mt-1 text-2xl font-bold">
                        Our little world
                      </h2>
                    </div>

                    <div className="flex size-12 items-center justify-center rounded-full bg-accent text-2xl">
                      🐣
                    </div>
                  </div>

                  <div className="mt-10 rounded-2xl bg-white/10 p-5 backdrop-blur">
                    <p className="text-sm text-white/70">Latest milestone</p>
                    <p className="mt-2 text-xl font-semibold">
                      Emma took her first steps
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      August 2, 2026
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <article className="rounded-2xl bg-accent p-5">
                    <span className="text-3xl">📸</span>
                    <p className="mt-8 text-2xl font-bold text-accent-foreground">
                      248
                    </p>
                    <p className="text-sm text-muted">Saved memories</p>
                  </article>

                  <article className="rounded-2xl bg-primary-light p-5">
                    <span className="text-3xl">🌱</span>
                    <p className="mt-8 text-2xl font-bold">16</p>
                    <p className="text-sm text-muted">Milestones</p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="border-y border-border bg-accent-light"
        >
          <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted">
                Everything in one nest
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight">
                A home for the memories that matter
              </h2>

              <p className="mt-5 text-lg leading-8 text-muted">
                Capture moments as they happen and build a personal family
                archive that grows with your child.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {memories.map((memory) => (
                <article
                  key={memory.title}
                  className="rounded-3xl border border-border bg-card p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-accent text-2xl">
                    {memory.icon}
                  </div>

                  <h3 className="mt-6 text-xl font-bold">{memory.title}</h3>

                  <p className="mt-3 leading-7 text-muted">
                    {memory.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about">
          <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8">
            <div className="rounded-[2rem] bg-primary px-8 py-16 text-center text-primary-foreground sm:px-16">
              <span className="text-5xl">🪺</span>

              <h2 className="mx-auto mt-6 max-w-2xl text-4xl font-bold tracking-tight">
                Start building your family’s memory nest today
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/75">
                Create a private space for the moments, stories and milestones
                your family never wants to forget.
              </p>

              <a
                href="/register"
                className="mt-9 inline-block rounded-full bg-accent px-8 py-3.5 font-bold text-accent-foreground transition hover:bg-accent-dark"
              >
                Create your free nest
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© 2026 Memory Nest. All rights reserved.</p>

          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-foreground">
              Privacy
            </a>

            <a href="/terms" className="hover:text-foreground">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}