import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from '@/lib/session'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata: Metadata = {
  title: 'MentoraAI — Algorithm Learning & Interview Prep',
  description: 'Turns YouTube lectures into structured notes, visualizes every algorithm, and preps you for interviews with a live AI interviewer.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8F5F2' },
    { media: '(prefers-color-scheme: dark)', color: '#111113' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const _addEvent = window.addEventListener;
              window.addEventListener = function(type, listener, options) {
                if (type === 'unhandledrejection') {
                  const originalListener = listener;
                  listener = function(event) {
                    if (event.reason && event.reason.msg === 'operation is manually canceled') {
                      event.preventDefault();
                      event.stopImmediatePropagation();
                      return;
                    }
                    return originalListener.apply(this, arguments);
                  };
                }
                return _addEvent.call(this, type, listener, options);
              };
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="mentora-theme">
          <SessionProvider>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
