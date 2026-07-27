import { AppleIcon, ArrowIcon, ExternalIcon, GitHubIcon } from "./icons";

type LinkType = "external" | "github" | "appstore";

type ProjectLink = {
  label: string;
  href: string;
  type: LinkType;
};

type Project = {
  name: string;
  kind: "Personal" | "Enterprise";
  org?: string;
  problem: string;
  outcome: string;
  note?: string;
  tech: string[];
  links?: ProjectLink[];
};

const projects: Project[] = [
  {
    name: "African Stores Canada",
    kind: "Personal",
    problem:
      "Helping the African diaspora find grocery stores stocking familiar food across Canada.",
    outcome:
      "Production LangGraph agentic pipeline on AWS Bedrock (Claude Haiku 4.5) — typed StateGraph, native tool calling and MongoDB Atlas checkpointing for crash-resumable reasoning. The agent autonomously searches, scrapes and catalogues over 500 businesses across all 10 provinces at under $0.50 per national crawl. Live Next.js web app with a password-gated /ops dashboard and a companion iOS app on the App Store.",
    tech: ["AWS Bedrock", "LangGraph", "Claude Haiku 4.5", "MongoDB Atlas", "Next.js", "SwiftUI"],
    links: [
      { label: "africanstorescanada.ca", href: "https://www.africanstorescanada.ca/", type: "external" },
      { label: "App Store", href: "https://apps.apple.com/ca/app/africanstores/id6774342218", type: "appstore" },
      { label: "Repo", href: "https://github.com/kere-sifon/african-stores-agent", type: "github" },
    ],
  },
  {
    name: "Igbo-English RAG Translator",
    kind: "Personal",
    problem:
      "Preserving the Igbo language for the next generation — a heritage project for my family.",
    outcome:
      "Rebuilt on Vertex AI RAG Engine (text-embedding-005, Gemini 2.0 Flash), migrated off a local FAISS/Ollama stack and provisioned end-to-end with Terraform + OIDC. Ingested 1M curated Igbo-English pairs from a 19.5M-row NLLB dataset, reaching a RAGAS answer-relevancy of 0.833, served via FastAPI with retrieval scoring and citations.",
    note: "My wife and I both carry Igbo heritage. This one is for our children.",
    tech: ["Vertex AI RAG", "Gemini 2.0 Flash", "text-embedding-005", "Terraform", "RAGAS", "FastAPI"],
    links: [
      { label: "Repo", href: "https://github.com/kere-sifon/igbo-rag", type: "github" },
    ],
  },
  {
    name: "CI Triage Agent",
    kind: "Personal",
    problem:
      "Cutting through SAST/SCA security-scan noise so engineers only see findings that matter.",
    outcome:
      "A reusable GitHub Actions composite action pipes scan output through a LangGraph agent on AWS Bedrock to classify true positives vs. noise and post structured PR summaries — hardened with OIDC and SHA-pinned actions. The same triage logic is exposed as an MCP server (ci-triage-mcp), so any MCP client can query results interactively (validated via Claude Desktop). The LangGraph state machine keeps every decision auditable and reproducible.",
    tech: ["LangGraph", "AWS Bedrock", "MCP", "GitHub Actions", "OIDC", "Python"],
    links: [
      { label: "Repo", href: "https://github.com/kere-sifon/Ci-mvp", type: "github" },
    ],
  },
  {
    name: "k8s-cost-agent",
    kind: "Personal",
    problem:
      "Catching Kubernetes cost and resource-usage anomalies before they turn into waste.",
    outcome:
      "A read-only LangGraph supervisor-worker agent on AWS Bedrock that compares live cluster metrics against peer workloads in the same namespace, then drafts a plain-English explanation and remediation suggestion (rightsizing, unbounded limits, orphaned PVCs) for a human to act on — never auto-applied. Exposed as an MCP server for multi-cluster querying via Claude Desktop. Access is locked to a read-only ServiceAccount (get/list/watch only) with RBAC as code and live-binding verification.",
    tech: ["LangGraph", "AWS Bedrock", "Kubernetes", "MCP", "RBAC", "Python"],
    links: [
      { label: "Repo", href: "https://github.com/kere-sifon/k8s-cost-agent", type: "github" },
    ],
  },
  {
    name: "AI Log Monitoring System",
    kind: "Personal",
    problem:
      "Detecting anomalies in application logs with an automated, secure MLOps pipeline.",
    outcome:
      "End-to-end AWS MLOps pipeline on SageMaker Pipelines (preprocess → train → evaluate → register) deploying an Isolation Forest model with promotion gated on F1 score. Terraform-managed infra with HCP remote state and GitHub OIDC — no static credentials — and multi-stage security gates (Bandit, CodeQL, OWASP, SonarCloud, Trivy) across AKS and AWS.",
    tech: ["SageMaker", "Terraform", "GitHub OIDC", "Spring Boot", "Angular", "Kubernetes"],
    links: [
      { label: "Repo", href: "https://github.com/orgs/kere-sifon/repositories?q=topic:ai-log-monitoring", type: "github" },
    ],
  },
  {
    name: "No Wahala Receipt — iOS",
    kind: "Personal",
    problem:
      "Turning photos of receipts into structured expense data for family budgets.",
    outcome:
      "Published iOS app integrating Google Gemini for OCR-based receipt scanning and automatic expense extraction. Secure auth with 2FA, email verification and role-based access for multi-tenant family accounts, plus an analytics dashboard with spending insights and export.",
    tech: ["Swift", "SwiftUI", "MVVM", "Gemini AI", "Firebase"],
    links: [
      { label: "App Store", href: "https://apps.apple.com/us/app/no-wahala-receipt/id6752734272", type: "appstore" },
    ],
  },
];

const kindStyles: Record<Project["kind"], string> = {
  Personal: "border-[var(--accent)] text-[var(--accent)]",
  Enterprise: "border-[var(--border)] text-[var(--text-2)]",
};

function LinkIcon({ type }: { type: LinkType }) {
  if (type === "github") return <GitHubIcon className="h-4 w-4" />;
  if (type === "appstore") return <AppleIcon className="h-4 w-4" />;
  return <ExternalIcon className="h-4 w-4" />;
}

export default function Projects() {
  return (
    <section id="projects" className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="mono-label">Projects</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Selected work
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.name}
              className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-[var(--accent)] hover:shadow-[0_0_28px_rgba(0,201,177,0.12)]"
            >
              <div className="flex items-center gap-3">
                <h3 className="font-display text-xl font-semibold tracking-tight">
                  {project.name}
                </h3>
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider ${kindStyles[project.kind]}`}
                >
                  {project.kind}
                </span>
              </div>

              {project.org && (
                <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
                  {project.org}
                </p>
              )}

              <p className="mt-3 text-sm font-medium text-[var(--text)]">
                {project.problem}
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-2)]">
                {project.outcome}
              </p>

              {project.note && (
                <p className="mt-3 border-l-2 border-[var(--accent-2)] pl-3 text-sm italic text-[var(--text-2)]">
                  {project.note}
                </p>
              )}

              <ul className="mt-4 flex flex-wrap gap-1.5">
                {project.tech.map((tech) => (
                  <li key={tech} className="tech-pill">
                    {tech}
                  </li>
                ))}
              </ul>

              {project.links && (
                <div className="mt-5 flex flex-wrap gap-4 border-t border-[var(--border)] pt-4">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] transition-opacity hover:opacity-80"
                    >
                      <LinkIcon type={link.type} />
                      {link.label}
                      <ArrowIcon className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
