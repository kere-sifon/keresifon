import { GitHubIcon, LinkedInIcon } from "./icons";

const techStack = [
  "LangGraph",
  "AWS Bedrock",
  "Vertex AI",
  "Kubernetes",
  "OpenShift 4.x",
  "Terraform",
  "Istio",
  "ArgoCD",
  "Python",
];

const stats = [
  { value: "14+", label: "years engineering" },
  { value: "2+", label: "yrs production AI" },
  { value: "500+", label: "businesses cataloged" },
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-5 pb-16 pt-32 sm:px-8 sm:pt-40"
    >
      <div className="hero-dotgrid pointer-events-none absolute inset-0" />
      <div className="hero-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-4xl">
        <h1
          className="animate-fade-up font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl"
          style={{ animationDelay: "0.05s" }}
        >
          Kere Ekpenyong
        </h1>

        <h2
          className="animate-fade-up mt-3 font-display text-2xl font-semibold tracking-tight text-[var(--accent)] sm:text-3xl"
          style={{ animationDelay: "0.1s" }}
        >
          Senior AI &amp; Platform Engineer
        </h2>

        <p
          className="animate-fade-up mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-2)] sm:text-lg"
          style={{ animationDelay: "0.15s" }}
        >
          14+ years of platform engineering and 2+ years shipping production LLM
          and agentic systems — LangGraph supervisor-worker agents on AWS
          Bedrock, RAG pipelines on Vertex AI. Specializing in cloud-native
          infrastructure on OpenShift and Kubernetes. Based in Toronto.
        </p>

        <ul
          className="animate-fade-up mt-7 flex flex-wrap gap-2"
          style={{ animationDelay: "0.2s" }}
        >
          {techStack.map((tech) => (
            <li key={tech} className="tech-pill">
              {tech}
            </li>
          ))}
        </ul>

        <div
          className="animate-fade-up mt-8 flex flex-wrap items-center gap-4"
          style={{ animationDelay: "0.25s" }}
        >
          <a
            href="#projects"
            className="rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--bg)] transition-all hover:shadow-[0_0_24px_rgba(0,201,177,0.35)]"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="rounded-lg border border-[var(--border)] px-6 py-3 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Get in Touch
          </a>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/keresifon"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub — personal"
              title="keresifon (personal)"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-2)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <GitHubIcon className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/kereisidore"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-2)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <LinkedInIcon className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/kere-sifon"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub organization — kere-sifon"
              title="kere-sifon (organization)"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-2)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <GitHubIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <dl
          className="animate-fade-up mt-14 grid grid-cols-3 gap-6 border-t border-[var(--border)] pt-8"
          style={{ animationDelay: "0.3s" }}
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="font-display text-3xl font-bold text-[var(--text)]">
                {stat.value}
              </dt>
              <dd className="mt-1 text-xs text-[var(--text-2)]">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
