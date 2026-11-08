"use client";

import { RouterProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { SearchProvider } from "@/hooks/use-search-state";
import { AIAssistantProvider } from "@/components/AIAssistant";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  return (
    <RouterProvider navigate={router.push}>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <SearchProvider>
          <AIAssistantProvider>
            {children}
          </AIAssistantProvider>
        </SearchProvider>
      </NextThemesProvider>
    </RouterProvider>
  );
}
