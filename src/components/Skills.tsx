const skillGroups = [
  {
    label: "AI / Agentic Engineering",
    skills: [
      "LangGraph",
      "LangChain",
      "AWS Bedrock",
      "Vertex AI RAG",
      "Gemini 2.0 Flash",
      "Claude Haiku 4.5",
      "RAGAS",
      "FAISS",
      "SageMaker",
    ],
  },
  {
    label: "Container & Orchestration",
    skills: ["OpenShift 4.x", "Kubernetes", "Docker", "Podman", "Helm", "Istio"],
  },
  {
    label: "Cloud Platforms",
    skills: ["AWS", "GCP", "Azure", "On-Prem"],
  },
  {
    label: "IaC & Automation",
    skills: ["Terraform", "Ansible", "AWS CDK", "CloudFormation", "OIDC"],
  },
  {
    label: "CI/CD & GitOps",
    skills: ["GitLab CI", "GitHub Actions", "Jenkins", "ArgoCD", "Azure DevOps"],
  },
  {
    label: "Security & Quality",
    skills: ["Checkmarx", "Mend", "CodeQL", "Trivy", "SonarCloud", "Bandit"],
  },
  {
    label: "Observability",
    skills: ["Prometheus", "Grafana", "Datadog", "CloudWatch", "ELK", "Sentry"],
  },
  {
    label: "Languages & Data",
    skills: ["Python", "TypeScript", "Java", "Bash", "PostgreSQL", "MongoDB", "Redis"],
  },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="bg-[var(--skills-bg)] px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <p className="mono-label">Skills</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          The toolkit
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {skillGroups.map((group) => (
            <div
              key={group.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <p className="mono-label">{group.label}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <li key={skill} className="tech-pill">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
