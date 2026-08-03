/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

type IconName =
  | "lock"
  | "users"
  | "heart"
  | "image"
  | "calendar"
  | "book"
  | "mail"
  | "arrow"
  | "bell"
  | "nest";

type IconProps = {
  name: IconName;
  className?: string;
};

function Icon({ name, className = "size-5" }: IconProps) {
  const commonProps = {
    className,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  const icons: Record<IconName, React.ReactNode> = {
    lock: (
      <svg {...commonProps}>
        <rect x="5" y="10" width="14" height="11" rx="3" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    ),

    users: (
      <svg {...commonProps}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),

    heart: (
      <svg {...commonProps}>
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
      </svg>
    ),

    image: (
      <svg {...commonProps}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    ),

    calendar: (
      <svg {...commonProps}>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </svg>
    ),

    book: (
      <svg {...commonProps}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </svg>
    ),

    mail: (
      <svg {...commonProps}>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),

    arrow: (
      <svg {...commonProps}>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    ),

    bell: (
      <svg {...commonProps}>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M13.7 21a2 2 0 0 1-3.4 0" />
      </svg>
    ),

    nest: (
      <svg {...commonProps}>
        <path d="M4 15c4 3 12 3 16 0" />
        <path d="M5 12c4 3 10 3 14 0" />
        <path d="M7 9c3 2 7 2 10 0" />
        <path d="M12 9V3" />
        <path d="M12 5c-2-2-4-2-5-1 1 3 3 4 5 3" />
        <path d="M12 5c2-2 4-2 5-1-1 3-3 4-5 3" />
      </svg>
    ),
  };

  return icons[name];
}

const features = [
  {
    icon: "image" as const,
    title: "Photos & videos",
    description:
      "Save and organize your favourite family moments in one beautiful space.",
  },
  {
    icon: "calendar" as const,
    title: "Milestones",
    description:
      "Capture first words, first steps and every meaningful achievement.",
  },
  {
    icon: "book" as const,
    title: "Stories",
    description:
      "Write down the small stories that would otherwise be forgotten.",
  },
  {
    icon: "mail" as const,
    title: "Letters to the future",
    description:
      "Create private letters your child can discover later in life.",
  },
];

const gallery = [
  {
    src: "https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=600&q=85",
    alt: "Smiling baby",
  },
  {
    src: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=600&q=85",
    alt: "Mother and child",
  },
  {
    src: "https://images.unsplash.com/photo-1602030028438-4cf153cbae9e?auto=format&fit=crop&w=600&q=85",
    alt: "Child playing outdoors",
  },
  {
    src: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?auto=format&fit=crop&w=600&q=85",
    alt: "Family at the beach",
  },
  {
    src: "https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=600&q=85",
    alt: "Child blowing bubbles",
  },
  {
    src: "https://images.unsplash.com/photo-1602030028651-74e4e5a7a6a8?auto=format&fit=crop&w=600&q=85",
    alt: "Happy child",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute left-[-180px] top-[330px] size-[440px] rounded-full bg-accent/70 blur-[100px]" />
      <div className="pointer-events-none absolute right-[-180px] top-[-80px] size-[560px] rounded-full bg-primary-soft blur-[110px]" />
      <div className="pointer-events-none absolute bottom-[15%] right-[5%] size-[380px] rounded-full bg-accent/45 blur-[100px]" />

      <header className="relative z-50 px-4 pt-5 sm:px-6 lg:px-8">
        <div className="glass mx-auto flex w-full max-w-7xl items-center justify-between rounded-[28px] px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-primary shadow-sm">
              <Icon name="nest" className="size-6" />
            </span>

            <span className="text-lg font-bold tracking-[-0.03em] sm:text-xl">
              Memory Nest
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
            <a className="transition-opacity hover:opacity-60" href="#features">
              Features
            </a>

            <a className="transition-opacity hover:opacity-60" href="#about">
              About
            </a>

            <a className="transition-opacity hover:opacity-60" href="#memories">
              Memories
            </a>

            <a className="transition-opacity hover:opacity-60" href="#security">
              Security
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="/login"
              className="hidden rounded-full border border-primary/20 bg-white/20 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/50 sm:inline-flex"
            >
              Log in
            </a>

            <a
              href="/register"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(15,60,101,0.22)] transition hover:-translate-y-0.5 hover:bg-primary-hover"
            >
              Get started
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="px-4 pb-14 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-20">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1fr_0.82fr] lg:gap-20">
            <div>
              <div className="glass mb-7 inline-flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium">
                <Icon name="lock" className="size-4" />
                A private home for your family memories
              </div>

              <h1 className="text-balance max-w-3xl text-5xl font-bold leading-[0.98] tracking-[-0.065em] sm:text-6xl lg:text-[76px]">
                Cherish today.
                <span className="mt-2 block">
                  Treasure{" "}
                  <span className="text-[#e9bd55]">forever.</span>
                </span>
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-8 text-muted sm:text-xl">
                Memory Nest helps you save the little moments, milestones and
                stories that make your family&apos;s journey unforgettable.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-primary px-7 py-4 font-semibold text-white shadow-[0_14px_36px_rgba(15,60,101,0.2)] transition hover:-translate-y-1 hover:bg-primary-hover"
                >
                  Create your nest
                  <Icon name="arrow" className="size-5" />
                </a>

                <a
                  href="#features"
                  className="glass inline-flex items-center justify-center gap-3 rounded-full px-7 py-4 font-semibold transition hover:-translate-y-1 hover:bg-white/70"
                >
                  See how it works
                  <span className="flex size-6 items-center justify-center rounded-full border border-primary/25">
                    ▶
                  </span>
                </a>
              </div>

              <div className="glass mt-11 grid max-w-xl gap-4 rounded-[24px] px-5 py-4 text-sm sm:grid-cols-3">
                <div className="flex items-center gap-3">
                  <Icon name="lock" className="size-5" />
                  <span>Private & secure</span>
                </div>

                <div className="flex items-center gap-3">
                  <Icon name="users" className="size-5" />
                  <span>For families</span>
                </div>

                <div className="flex items-center gap-3">
                  <Icon name="heart" className="size-5" />
                  <span>Easy to use</span>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[535px]">
              <div className="absolute -inset-12 rounded-full bg-primary-soft/70 blur-[80px]" />

              <div className="glass-strong relative rounded-[36px] p-5 sm:p-7">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg">Welcome back,</p>
                    <h2 className="text-2xl font-bold">Alexandra</h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Notifications"
                      className="flex size-11 items-center justify-center rounded-full bg-white/40 transition hover:bg-white/80"
                    >
                      <Icon name="bell" className="size-5" />
                    </button>

                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=140&q=85"
                      alt="User avatar"
                      className="size-12 rounded-full object-cover ring-2 ring-white/80"
                    />
                  </div>
                </div>

                <div className="glass mt-7 rounded-[30px] p-4 sm:p-5">
                  <p className="mb-4 font-medium">Today&apos;s memory</p>

                  <div className="relative overflow-hidden rounded-[24px]">
                    <img
                      src="https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=900&q=90"
                      alt="A smiling baby"
                      className="h-[265px] w-full object-cover"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-5 pb-5 pt-14 text-white">
                      <h3 className="text-2xl font-semibold">First steps</h3>
                      <p className="text-white/80">August 2, 2026</p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center gap-2">
                    <span className="h-2 w-6 rounded-full bg-primary" />
                    <span className="size-2 rounded-full bg-primary/20" />
                    <span className="size-2 rounded-full bg-primary/20" />
                    <span className="size-2 rounded-full bg-primary/20" />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {features.map((feature) => (
                    <a
                      key={feature.title}
                      href="#features"
                      className="glass flex min-h-24 flex-col items-center justify-center gap-3 rounded-[22px] px-2 py-4 text-center text-sm transition hover:-translate-y-1 hover:bg-white/75"
                    >
                      <Icon name={feature.icon} className="size-6" />

                      <span>
                        {feature.title === "Photos & videos"
                          ? "Photos"
                          : feature.title === "Letters to the future"
                            ? "Letters"
                            : feature.title}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="glass mx-auto w-full max-w-7xl rounded-[36px] p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                  Your family archive
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                  Everything in one place
                </h2>
              </div>

              <a
                href="/register"
                className="glass inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:bg-white/75"
              >
                View all
                <Icon name="arrow" className="size-4" />
              </a>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <article
                  key={feature.title}
                  className="glass-strong group rounded-[28px] p-6 transition duration-300 hover:-translate-y-2"
                >
                  <div
                    className={`flex size-14 items-center justify-center rounded-2xl ${
                      index % 2 === 0 ? "bg-primary-soft" : "bg-accent"
                    }`}
                  >
                    <Icon name={feature.icon} className="size-7" />
                  </div>

                  <h3 className="mt-7 text-lg font-bold">{feature.title}</h3>

                  <p className="mt-3 min-h-20 text-sm leading-6 text-muted">
                    {feature.description}
                  </p>

                  <a
                    href="/register"
                    aria-label={`Open ${feature.title}`}
                    className="mt-5 inline-flex transition group-hover:translate-x-1"
                  >
                    <Icon name="arrow" className="size-5" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="about"
          className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        >
          <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <article className="relative min-h-[390px] overflow-hidden rounded-[36px] border border-white/90 bg-accent p-8 shadow-[0_24px_70px_rgba(15,60,101,0.1)] sm:p-10">
              <div className="absolute -bottom-24 -right-16 size-80 rounded-full border border-primary/10" />
              <div className="absolute -bottom-14 -right-2 size-60 rounded-full border border-primary/10" />

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.17em] text-primary/55">
                    Made with care
                  </p>

                  <h2 className="mt-5 max-w-sm text-4xl font-bold leading-tight tracking-[-0.045em]">
                    Built for what matters most
                  </h2>

                  <p className="mt-5 max-w-sm text-lg leading-8 text-primary/70">
                    Because the little things often become the biggest
                    memories.
                  </p>
                </div>

                <a
                  href="/register"
                  className="mt-10 inline-flex w-fit items-center gap-3 rounded-full bg-primary px-6 py-3.5 font-semibold text-white transition hover:-translate-y-1 hover:bg-primary-hover"
                >
                  Start your journey
                  <Icon name="arrow" className="size-5" />
                </a>
              </div>
            </article>

            <article
              id="memories"
              className="glass rounded-[36px] p-5 sm:p-7"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Recent memories</h2>

                <a
                  href="/register"
                  className="text-sm font-medium hover:opacity-60"
                >
                  See all
                </a>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((image) => (
                  <a
                    key={image.src}
                    href="/register"
                    className="group relative overflow-hidden rounded-[20px]"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="aspect-[1.15/1] w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-primary/0 transition group-hover:bg-primary/10" />
                  </a>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section
          id="security"
          className="px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24"
        >
          <div className="glass mx-auto grid w-full max-w-7xl items-center gap-8 rounded-[36px] p-7 sm:p-9 lg:grid-cols-[1fr_auto]">
            <div className="flex items-start gap-5">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/50">
                <span className="text-4xl font-bold leading-none">“</span>
              </div>

              <div>
                <blockquote className="max-w-2xl text-lg font-medium leading-8 sm:text-xl">
                  Memory Nest helped us keep our family stories organized and
                  close to our hearts.
                </blockquote>

                <p className="mt-4 text-sm text-muted">
                  Sophie, mother of two
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-[26px] bg-white/35 px-5 py-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-white/55">
                <Icon name="lock" className="size-7" />
              </div>

              <div>
                <p className="font-semibold">Your memories.</p>
                <p className="text-muted">Always private.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          <div className="glass-dark mx-auto flex w-full max-w-7xl flex-col items-center overflow-hidden rounded-[38px] px-6 py-16 text-center text-white sm:px-10 lg:py-20">
            <span className="flex size-16 items-center justify-center rounded-[22px] bg-white/10">
              <Icon name="nest" className="size-9" />
            </span>

            <h2 className="text-balance mt-7 max-w-3xl text-4xl font-bold tracking-[-0.05em] sm:text-5xl">
              Give your family memories a place made to last.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
              Build a private family archive filled with moments, milestones,
              stories and love.
            </p>

            <a
              href="/register"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 font-bold text-primary transition hover:-translate-y-1 hover:bg-accent-hover"
            >
              Create your Memory Nest
              <Icon name="arrow" className="size-5" />
            </a>
          </div>
        </section>
      </main>

      <footer className="relative z-10 px-4 pb-6 sm:px-6 lg:px-8">
        <div className="glass mx-auto flex w-full max-w-7xl flex-col gap-5 rounded-[26px] px-6 py-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-primary">
              <Icon name="nest" className="size-5" />
            </span>

            <p>© 2026 Memory Nest</p>
          </div>

          <div className="flex flex-wrap gap-6">
            <a href="/privacy" className="transition hover:text-foreground">
              Privacy
            </a>

            <a href="/terms" className="transition hover:text-foreground">
              Terms
            </a>

            <a href="/contact" className="transition hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}