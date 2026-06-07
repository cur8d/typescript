import { PageHeader } from "@/components/PageHeader";
import { Card } from "@heroui/react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 pb-12">
      <PageHeader
        title="About Blueprint"
        description="Learn more about the philosophy and technology behind this template."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-2xl font-bold">Our Mission</h2>
            <p className="text-lg text-muted-foreground">
              Blueprint was created to solve the "blank page" problem. We provide a solid,
              opinionated foundation that allows developers to skip the setup and jump
              straight into building unique value for their users.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold">The Tech Stack</h2>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li><strong>Next.js 15:</strong> The React framework for the web.</li>
              <li><strong>HeroUI:</strong> Beautiful, fast, and modern React UI library.</li>
              <li><strong>Tailwind CSS v4:</strong> Utility-first CSS with a new engine.</li>
              <li><strong>TypeScript:</strong> Static typing for better developer experience.</li>
              <li><strong>Supabase:</strong> Open source Firebase alternative.</li>
            </ul>
          </section>
        </div>

        <Card className="p-8 bg-primary/5 border-primary/10">
          <Card.Header className="p-0 pb-4">
             <Card.Title className="text-xl font-bold">
               <h3>Why Blueprint?</h3>
             </Card.Title>
          </Card.Header>
          <Card.Content className="p-0 space-y-4 text-muted-foreground">
            <p>
              Traditional boilerplates often come with too much "stuff" that you end up deleting.
              Blueprint is designed to be minimal yet complete, giving you exactly what you need
              and nothing you don't.
            </p>
            <p>
              Accessibility, performance, and SEO are baked in from the start, not added as an
              afterthought.
            </p>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
