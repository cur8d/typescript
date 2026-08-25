import { tool } from "ai";
import { z } from "zod";
import { env } from "@/lib/env";

export interface DocItem {
  title: string;
  path: string;
  description: string;
  category: string;
}

export interface SystemInfo {
  name: string;
  version: string;
  framework: string;
  runtime: string;
  designSystem: string;
  aiStack: string;
  environment: string;
  provider: string;
  status: string;
}

export const DOCS_CATALOG: DocItem[] = [
  {
    title: "Project Overview",
    path: "/docs",
    description: "Learn about the cur8d starter architecture, philosophy, and features.",
    category: "Getting Started",
  },
  {
    title: "Environment Variables",
    path: "/docs/getting-started/environment-variables",
    description: "Manage and validate environment variables with Zod.",
    category: "Getting Started",
  },
  {
    title: "AI Assistant",
    path: "/docs/features/ai-assistant",
    description: "assistant-ui and Vercel AI SDK integration with zero-config mock mode.",
    category: "Features",
  },
  {
    title: "Theme & Dark Mode",
    path: "/docs/features/theme",
    description: "next-themes and Tailwind CSS v4 CSS variables integration.",
    category: "Features",
  },
  {
    title: "Testing Guide",
    path: "/docs/reference/testing",
    description: "Vitest unit tests (80% coverage) and Playwright a11y testing.",
    category: "Reference",
  },
  {
    title: "CLI & Mise Commands",
    path: "/docs/reference/commands",
    description: "Toolchain commands for dev, verify, test, lint, and build.",
    category: "Reference",
  },
  {
    title: "Deployment",
    path: "/docs/deployment",
    description: "Deploy cur8d to Vercel, Render, or Firebase Hosting.",
    category: "Deployment",
  },
];

export const searchDocumentation = tool({
  description: "Search documentation and feature guides for cur8d.",
  inputSchema: z.object({
    query: z.string().describe("Search keywords or topic to find"),
  }),
  execute: async ({ query }: { query: string }) => {
    const q = query.toLowerCase();
    const results = DOCS_CATALOG.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );

    return {
      query,
      results: results.length > 0 ? results : DOCS_CATALOG.slice(0, 3),
    };
  },
});

export const setTheme = tool({
  description: "Set the active color theme of the application (light, dark, or system).",
  inputSchema: z.object({
    theme: z.enum(["light", "dark", "system"]).describe("The desired theme"),
  }),
  execute: async ({ theme }: { theme: "light" | "dark" | "system" }) => {
    return {
      success: true,
      theme,
      message: `Theme has been requested to be set to '${theme}'.`,
    };
  },
});

export const getSystemInfo = tool({
  description: "Get technical specifications and version metadata for the cur8d stack.",
  inputSchema: z.object({}),
  execute: async () => {
    return {
      name: "cur8d",
      version: "0.1.0",
      framework: "Next.js 16 (App Router / Turbopack)",
      runtime: "React 19 Server Components",
      designSystem: "HeroUI v3 + Tailwind CSS v4",
      aiStack: "assistant-ui + Vercel AI SDK",
      environment: env.NODE_ENV,
      provider: env.AI_PROVIDER,
      status: "operational",
    };
  },
});

export const navigatePage = tool({
  description: "Navigate to a specific page or route within the cur8d application.",
  inputSchema: z.object({
    route: z.string().describe("Target route path (e.g., '/', '/docs', '/docs/features/ai-assistant')"),
  }),
  execute: async ({ route }: { route: string }) => {
    return {
      success: true,
      route,
      message: `Navigating to ${route}`,
    };
  },
});

export const aiTools = {
  searchDocumentation,
  setTheme,
  getSystemInfo,
  navigatePage,
};
