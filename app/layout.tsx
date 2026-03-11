import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { siteConfig } from '@/lib/site-config'
import './globals.css'

const _inter = Inter({ subsets: ["latin"] })
const _jetBrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description:
    `Portfolio of ${siteConfig.name} - ${siteConfig.tagline}`,
  keywords: [
    'Full-Stack Engineer',
    'Software Developer',
    'React',
    'Node.js',
    'TypeScript',
  ],
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description:
      `Portfolio of ${siteConfig.name} - ${siteConfig.tagline}`,
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
