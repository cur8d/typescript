/**
 * Reports an error to an error reporting service.
 * Currently logs to the console, but can be updated to use services like Sentry or Axiom.
 *
 * @param error - The error to report
 * @param context - Additional context information for the error
 */
export function reportError(error: Error | unknown, context?: Record<string, unknown>): void {
  // In a real application, you would send this to your error reporting service here.
  // For example: Sentry.captureException(error, { extra: context });

  // For now, we continue to log to the console to maintain existing behavior while providing a clean abstraction.
  if (context) {
    console.error(error, context);
  } else {
    console.error(error);
  }
}
