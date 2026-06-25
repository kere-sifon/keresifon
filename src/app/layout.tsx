import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = "https://keresifon.com";
const title = "Kere Ekpenyong — Senior AI & Platform Engineer";
const description =
  "Senior AI & Platform Engineer. 14+ years in cloud infrastructure and 2+ years building production LLM and agentic AI systems with LangGraph, AWS Bedrock and Vertex AI. IBM, Bell Canada CaaS, OpenShift 4.x. Based in Toronto.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "AI Engineer",
    "Agentic AI",
    "LLM Engineer",
    "RAG",
    "LangGraph",
    "AWS Bedrock",
    "Vertex AI",
    "Platform Engineer",
    "DevOps Engineer",
    "Site Reliability Engineer",
    "SRE",
    "Kubernetes",
    "OpenShift",
    "Terraform",
    "AWS",
    "GCP",
    "Toronto",
    "Kere Ekpenyong",
  ],
  authors: [{ name: "Kere Ekpenyong" }],
  creator: "Kere Ekpenyong",
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    url: siteUrl,
    title,
    description,
    siteName: "Kere Ekpenyong",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetBrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
