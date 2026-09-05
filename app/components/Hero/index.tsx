import { SiGithub } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import { ExternalLink, BookOpen } from "lucide-react";
import { CodeSnippet } from "@/components/CodeSnippet";

export function Hero() {
  return (
    <section className="container mx-auto px-4 pt-20 text-center">
      <h1 className="mb-6 text-5xl font-extrabold tracking-tight lg:text-6xl text-foreground">
        Build faster with <span className="text-primary">cur8d</span>
      </h1>
      <div className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
        <p>
          High-performance, accessible, and type-safe template for your next big
          idea.
        </p>
        <p>
          Powered by <span className="text-primary">Typescript</span>,{" "}
          <span className="text-primary">Next.js</span>,{" "}
          <span className="text-primary">HeroUI</span>, and{" "}
          <span className="text-primary">Tailwind CSS</span>.
        </p>
      </div>

      <div className="mx-auto mb-10 max-w-fit">
        <CodeSnippet code="npx create-cur8d --template tsx awesome-app" />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="https://cur8d.dev/typescript"
          className="btn-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          <BookOpen className="size-4" aria-hidden="true" />
          Documentation
          <ExternalLink
            className="size-4 text-primary-foreground/80"
            aria-hidden="true"
          />
          <span className="sr-only"> (opens in a new window)</span>
        </Link>
        <Link
          href="https://github.com/cur8d/typescript"
          className="btn-secondary"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiGithub className="h-5 w-5" aria-hidden="true" />
          GitHub
          <ExternalLink
            className="size-4 text-muted-foreground/80"
            aria-hidden="true"
          />
          <span className="sr-only"> (opens in a new window)</span>
        </Link>
      </div>
    </section>
  );
}
