"use client";

import { RouterProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { SearchProvider } from "@/hooks/use-search-state";

interface ProvidersProps {
  readonly children: React.ReactNode;
}

export function Providers({ children }: Readonly<ProvidersProps>) {
  const router = useRouter();

  return (
    <RouterProvider navigate={router.push}>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <SearchProvider>
          {children}
        </SearchProvider>
      </NextThemesProvider>
    </RouterProvider>
  );
}
