import { Card } from "@heroui/react";
import { ArrowRight, Shield, Zap, Globe, Github } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Cur8d Template",
    "description": "A modern Next.js cur8d template with HeroUI and Tailwind CSS v4",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
  };

  return (
    <div className="flex flex-col gap-20 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 text-center">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight lg:text-6xl">
          Build faster with <span className="text-primary">Cur8d</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
          A high-performance, accessible, and type-safe foundation for your next big idea.
          Powered by Next.js 16, HeroUI, and Tailwind CSS v4.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            View Dashboard
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="https://github.com"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-8 py-3 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <Github className="h-5 w-5" />
            GitHub
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Everything you need</h2>
          <p className="text-muted-foreground">Stop worrying about boilerplate and start building features.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="p-8">
            <Card.Header className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 p-0 text-primary">
              <Zap className="h-6 w-6" />
            </Card.Header>
            <Card.Content className="p-0 pt-4">
              <Card.Title className="mb-2 text-xl font-semibold">
                <h3>Lightning Fast</h3>
              </Card.Title>
              <p className="text-muted-foreground">
                Optimized for performance with Next.js App Router and React Server Components.
              </p>
            </Card.Content>
          </Card>
          <Card className="p-8">
            <Card.Header className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 p-0 text-primary">
              <Shield className="h-6 w-6" />
            </Card.Header>
            <Card.Content className="p-0 pt-4">
              <Card.Title className="mb-2 text-xl font-semibold">
                <h3>Type Safe</h3>
              </Card.Title>
              <p className="text-muted-foreground">
                Built with TypeScript and Zod for robust, error-free development.
              </p>
            </Card.Content>
          </Card>
          <Card className="p-8">
            <Card.Header className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 p-0 text-primary">
              <Globe className="h-6 w-6" />
            </Card.Header>
            <Card.Content className="p-0 pt-4">
              <Card.Title className="mb-2 text-xl font-semibold">
                <h3>Accessible</h3>
              </Card.Title>
              <p className="text-muted-foreground">
                WAI-ARIA compliant components ensuring your app is usable by everyone.
              </p>
            </Card.Content>
          </Card>
        </div>
      </section>
    </div>
  );
}
