import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Features } from "@/components/sections/Features";
import { DocAutomation } from "@/components/sections/DocAutomation";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";
import { Footer } from "@/components/sections/Footer";
import { faqs } from "@/lib/faq";
import { site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: site.name,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: site.url,
      description: site.description,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description:
          "Free Starter plan for up to 3 projects and 5 team members.",
      },
      featureList: [
        "13-stage project lifecycle tracking",
        "Stage-gate health monitoring",
        "Auto-generated project documentation",
        "Concurrent-stage visibility",
        "Sign-off gates with audit trail",
        "Role-based views",
      ],
    },
    {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      email: site.email,
      description:
        "Prarambh builds project-lifecycle management software that guides teams through all 13 stages of project development.",
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <Features />
        <DocAutomation />
        <Testimonials />
        <Pricing />
        <Faq />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
