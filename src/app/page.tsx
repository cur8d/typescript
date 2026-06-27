import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "cur8d.tsx",
  "description": "A modern typescript Next.js starter template with HeroUI and Tailwind CSS for building high-performance, accessible, and type-safe web applications.",
  "url": "https://github.com/cur8d/typescript",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "All",
};

const JSON_LD_STRING = JSON.stringify(JSON_LD);

export default function Page() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      <script type="application/ld+json">
        {JSON_LD_STRING}
      </script>
      <Hero />
      <Features />
    </div>
  );
}
