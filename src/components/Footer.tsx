import { GitHubIcon, LinkedInIcon } from "./icons";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div>
          <p className="text-sm text-[var(--text-2)]">
            Built with Next.js · © 2025 Kere Ekpenyong
          </p>
          <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
            This site is a portfolio piece — CI/CD via GitHub Actions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/keresifon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub — personal"
            title="keresifon (personal)"
            className="text-[var(--text-2)] transition-colors hover:text-[var(--accent)]"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/kere-sifon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub organization — kere-sifon"
            title="kere-sifon (organization)"
            className="text-[var(--text-2)] transition-colors hover:text-[var(--accent)]"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/kereisidore"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-[var(--text-2)] transition-colors hover:text-[var(--accent)]"
          >
            <LinkedInIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
