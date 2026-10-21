export const metadata = {
  title: 'AI Humanizer',
  description: 'Convert AI text to human-like text',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
