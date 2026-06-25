import { GitHubIcon, LinkedInIcon } from "./icons";

export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-[var(--skills-bg)] px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="mono-label">Contact</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Let&apos;s talk
        </h2>

        <a
          href="mailto:keresifon.isidore@gmail.com"
          className="mt-10 inline-block font-display text-xl font-semibold tracking-tight text-[var(--accent)] transition-all hover:drop-shadow-[0_0_18px_rgba(0,201,177,0.4)] sm:text-3xl"
        >
          keresifon.isidore@gmail.com
        </a>

        <div className="mt-10 flex items-center justify-center gap-3">
          <a
            href="https://www.linkedin.com/in/kereisidore"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-2)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <LinkedInIcon className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/keresifon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub — personal"
            title="keresifon (personal)"
            className="flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-2)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/kere-sifon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub organization — kere-sifon"
            title="kere-sifon (organization)"
            className="flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-2)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
