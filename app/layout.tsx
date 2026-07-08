import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { site } from "@/lib/site";
import { AlpanaPreloader } from "@/components/ui/AlpanaPreloader";
import { AuthModalProvider } from "@/components/auth/AuthModalProvider";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Project-Lifecycle Management for All 13 Stages`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "project lifecycle management",
    "stage-gate tracking",
    "project management software",
    "project documentation automation",
    "sign-off workflow",
    "13 stages of project development",
  ],
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: site.tagline,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    site: site.twitter,
    title: site.tagline,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: site.url,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <AlpanaPreloader />
        <AuthModalProvider>{children}</AuthModalProvider>
      </body>
    </html>
  );
}
