import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Geist, Geist_Mono } from 'next/font/google'
import 'nextra-theme-docs/style.css'
import './globals.css'
import { ReactNode } from 'react'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata = {
  title: 'Cur8d Documentation',
  description: 'Production-ready Next.js starter documentation'
}

const CURRENT_YEAR = new Date().getFullYear()

export default async function RootLayout({ children }: { children: ReactNode }) {
  const pageMap = await getPageMap()
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <Head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' vitals.vercel-insights.com; base-uri 'none'; form-action 'self'; upgrade-insecure-requests;"
        />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </Head>
      <body className="font-sans antialiased">
        <Layout
          navbar={<Navbar logo={
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight">Cur8d</span>
              <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Docs</span>
            </div>
          } />}
          footer={<Footer>
            <div className="flex flex-col gap-2">
              <p>© {CURRENT_YEAR} Cur8d. Built with Nextra.</p>
            </div>
          </Footer>}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/cur8d/typescript/tree/main/docs"
          editLink="Edit this page"
          sidebar={{
            defaultMenuCollapseLevel: 2,
            autoCollapse: true
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
