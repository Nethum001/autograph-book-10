import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: "Autograph Book'10",
  description: 'Leave a little note. Make a lasting memory.'
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
