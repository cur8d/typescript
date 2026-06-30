"use client";

import { useEffect } from "react";
import { Button } from "@heroui/react";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[calc(100vh-16rem)] flex-col items-center justify-center gap-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-danger/10">
        <AlertCircle className="h-10 w-10 text-danger" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Something went wrong!</h1>
        <p className="text-muted-foreground">
          An unexpected error occurred. We've been notified and are looking into it.
        </p>
      </div>
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="rounded-xl px-8"
        >
          Reload Page
        </Button>
        <Button
          variant="primary"
          onClick={() => reset()}
          className="rounded-xl px-8"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
