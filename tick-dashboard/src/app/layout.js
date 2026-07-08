import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

export const metadata = {
  title: 'TICKK | Outbound Audit',
  description: 'Delivery confirmations and engagement signals for your dispatched emails.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#f8fafc] text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  )
}