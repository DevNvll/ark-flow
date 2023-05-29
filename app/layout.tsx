'use client'
import { useEffect } from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import ApiKeyModal from '@/components/api-key-modal'
import { Toaster } from '@/components/ui/toaster'
import { bootstrapSettings } from '@/lib/settings'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ark Notes',
  description: 'Ask question about your notes using GPT'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    bootstrapSettings()
  }, [])

  return (
    <html lang="en">
      <body className={cn('dark h-screen', inter.className)}>
        <ApiKeyModal />
        <Toaster />
        <div className="flex-1 h-screen space-y-4">{children}</div>
      </body>
    </html>
  )
}
