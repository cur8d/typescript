import { Card } from "@heroui/react";
import { Shield, Zap, Globe } from "lucide-react";

export function Features() {
  return (
    <section className="container mx-auto px-4">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold">Everything you need</h2>
        <p className="text-muted-foreground">
          Stop worrying about boilerplate and start building features.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <Card className="p-8">
          <Card.Header className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 p-0 text-primary">
            <Zap className="h-6 w-6" />
          </Card.Header>
          <Card.Content className="p-0 pt-4">
            <Card.Title className="mb-2 text-xl font-semibold">
              Lightning Fast
            </Card.Title>
            <p className="text-muted-foreground">
              Optimized for performance with Next.js App Router and React Server
              Components.
            </p>
          </Card.Content>
        </Card>
        <Card className="p-8">
          <Card.Header className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 p-0 text-primary">
            <Shield className="h-6 w-6" />
          </Card.Header>
          <Card.Content className="p-0 pt-4">
            <Card.Title className="mb-2 text-xl font-semibold">
              Type Safe
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
              Accessible
            </Card.Title>
            <p className="text-muted-foreground">
              WAI-ARIA compliant components ensuring your app is usable by everyone.
            </p>
          </Card.Content>
        </Card>
      </div>
    </section>
  );
}
