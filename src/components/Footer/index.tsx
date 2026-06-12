export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {currentYear} Cur8d. All rights reserved.
        </p>
        {/* <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            Contact
          </Link>
        </div> */}
      </div>
    </footer>
  );
}
