import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'People Counting & Visitor Analytics Indonesia | SmartCounter',
    template: '%s | SmartCounter',
  },
  description: "Indonesia's #1 people counting and visitor analytics platform. AI-powered CCTV analytics with 99.9% accuracy for retail stores, malls, and shopping centers.",
}

export default function FrontendRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
