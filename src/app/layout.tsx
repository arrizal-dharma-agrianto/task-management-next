import { Inter } from 'next/font/google'
import './globals.css'
import ReduxProvider from './provider';
import { Toaster } from "@/components/ui/sonner";
// import TailwindColorBuilder from '@/components/TailwindColorBuilder';

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <TailwindColorBuilder /> */}
        <ReduxProvider>
          {children}
          <Toaster
            closeButton
            position="top-right"
            theme="light"
          />
        </ReduxProvider>
      </body>
    </html>
  )
}
