import { SiGithub } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import { CodeSnippet } from "@/components/CodeSnippet";

export function Hero() {
  return (
    <section className="container mx-auto px-4 pt-20 text-center">
      <h1 className="mb-6 text-5xl font-extrabold tracking-tight lg:text-6xl text-muted-foreground">
        Build faster with <span className="text-primary">cur8d</span>
      </h1>
      <div className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
        <p>
          High-performance, accessible, and type-safe template for your next big idea.
        </p>
        <p>
          Powered by <span className="text-primary">Typescript</span>,{" "}
          <span className="text-primary">Next.js</span>,{" "}
          <span className="text-primary">HeroUI</span>, and{" "}
          <span className="text-primary">Tailwind CSS</span>.
        </p>
      </div>

      <div className="mx-auto mb-10 max-w-fit">
        <CodeSnippet code="npx create-cur8d awesome-app --template tsx" />
      </div>

      <div className="flex justify-center gap-4">
        <Link
          href="https://github.com/cur8d/typescript"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-8 py-3 text-sm font-medium transition-colors hover:bg-secondary"
        >
          <SiGithub className="h-5 w-5" />
          GitHub
        </Link>
      </div>
    </section>
  );
}
