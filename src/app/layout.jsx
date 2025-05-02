import './globals.css'

export const metadata = {
  title: 'Task Manager',
  description: 'A task manager application built with Next.js and Tailwind CSS',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">{children}</body>
    </html>
  )
} 