import { Metadata } from 'next'
import '.././globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Anukabd',
  description: 'Organic and natural products',
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="">
          <div className="bg-white rounded">{children}</div>
        </div>
      </body>
    </html>
  )
}
