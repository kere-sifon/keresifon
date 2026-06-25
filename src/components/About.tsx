import Image from "next/image";

const certs = [
  {
    name: "IBM Generative & Agentic AI Developer",
    year: "2026",
    color: "#0f62fe",
  },
  {
    name: "HashiCorp Terraform Associate (003)",
    year: "2024",
    color: "#7c4dff",
  },
  {
    name: "Google Associate Cloud Engineer",
    year: "2024",
    color: "#34a853",
  },
  {
    name: "Gov. of Canada Reliability Status",
    year: "Active",
    color: "#d52b1e",
  },
];

const education = [
  {
    degree: "M.Sc. Information Systems Management",
    school: "University of Liverpool",
  },
  {
    degree: "B.Eng. Electronic Engineering",
    school: "University of Nigeria, Nsukka",
  },
];

export default function About() {
  return (
    <section id="about" className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="mono-label">About</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          From Lagos to Toronto
        </h2>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5 text-[var(--text-2)] leading-relaxed">
            <p>
              I spent a decade leading technology and DevOps at Socketworks in
              Lagos, then moved to Canada and into enterprise platform
              engineering — multi-tenant OpenShift estates, Istio service mesh,
              GitLab CI/CD, and the operational constraints that come with
              serving carriers and financial institutions at scale.
            </p>
            <p>
              Over the last two years my work has tilted toward AI. I build and
              ship production LLM and agentic systems — LangGraph supervisor-worker
              agents on AWS Bedrock, RAG pipelines on Vertex AI, evaluated with
              RAGAS. The through-line is full-stack ownership: from model
              integration to CI/CD, observability, and security.
            </p>
            <p>
              The side projects are where the AI work started. African Stores
              Canada is an agentic system that catalogues African businesses
              across Canada; igbo-rag is quieter — my wife and I both carry Igbo
              heritage, and I am building a retrieval-grounded translator to help
              preserve the language for our children.
            </p>
            <p>
              When I am not in a terminal I shoot photographs on a Sony A7III. It
              keeps me looking at the world a little differently.
            </p>

            <figure className="mt-2 max-w-sm">
              <div className="overflow-hidden rounded-xl border border-[var(--border)]">
                <Image
                  src="https://res.cloudinary.com/kwesiblack/image/upload/v1767839589/DSC04684_byhpdy.jpg"
                  alt="Black and white photograph of three young girls lying on a patterned rug, heads together, smiling up at the camera"
                  width={1200}
                  height={1200}
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-2 font-mono text-xs text-[var(--text-muted)]">
                On the A7III — the reason the Igbo project matters.
              </figcaption>
            </figure>
          </div>

          <div className="space-y-8">
            <div>
              <p className="mono-label">Certifications</p>
              <ul className="mt-4 space-y-3">
                {certs.map((cert) => (
                  <li
                    key={cert.name}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
                    style={{ borderLeft: `3px solid ${cert.color}` }}
                  >
                    <p className="text-sm font-medium text-[var(--text)]">
                      {cert.name}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-[var(--text-2)]">
                      {cert.year}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mono-label">Education</p>
              <ul className="mt-4 space-y-3">
                {education.map((edu) => (
                  <li
                    key={edu.degree}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
                  >
                    <p className="text-sm font-medium text-[var(--text)]">
                      {edu.degree}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--text-2)]">
                      {edu.school}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
