"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchPalette } from "@/components/SearchPalette";
import { ShortcutHint } from "@/components/ShortcutHint";
import { LayoutDashboard, Info, Search } from "lucide-react";
import { useSearchState } from "@/hooks/use-search-state";

export function Navbar() {
  const { onOpen } = useSearchState();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="font-bold">Blueprint</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Info className="h-4 w-4" />
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 pr-4">
             <Button
                variant="ghost"
                className="flex items-center gap-4 text-muted-foreground"
                onClick={onOpen}
             >
                <div className="flex items-center gap-2">
                   <Search className="h-4 w-4" />
                   <span className="text-sm">Search...</span>
                </div>
                <ShortcutHint shortcut="K" />
             </Button>
          </div>

          <SearchPalette />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
