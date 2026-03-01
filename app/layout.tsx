import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const _inter = Inter({ subsets: ["latin"] })
const _jetBrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Saul Puentes | Senior Full-Stack Software Engineer',
  description:
    'Portfolio von Saul Puentes - Senior Full-Stack Software Engineer mit 7+ Jahren Erfahrung in skalierbaren Systemen fur E-Commerce, SaaS und Logistikplattformen.',
  keywords: [
    'Full-Stack Engineer',
    'Software Developer',
    'React',
    'Node.js',
    'TypeScript',
    'Germany',
    'Austria',
    'DACH',
  ],
  openGraph: {
    title: 'Saul Puentes | Senior Full-Stack Software Engineer',
    description:
      'Portfolio von Saul Puentes - 7+ Jahre Erfahrung in skalierbaren Systemen.',
    type: 'website',
    locale: 'de_DE',
    alternateLocale: ['en_US', 'es_ES'],
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
    <html lang="de" className="scroll-smooth">
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
