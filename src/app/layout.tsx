import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaaS Analytics Dashboard",
  description: "Real-time analytics platform for B2B SaaS",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased` }>
        <div className="min-h-dvh">
          <header className="border-b border-gray-900/50 bg-black/20 backdrop-blur supports-[backdrop-filter]:bg-black/10">
            <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
              <a href="/" className="font-medium">SaaS Analytics</a>
              <nav className="hidden sm:flex gap-4 text-sm text-gray-300">
                <a className="hover:text-white" href="/charts">Charts</a>
                <a className="hover:text-white" href="/dashboards">Dashboards</a>
                <a className="hover:text-white" href="/segments">Segments</a>
                <a className="hover:text-white" href="/reports">Reports</a>
              </nav>
            </div>
          </header>
          <div className="max-w-6xl mx-auto">{children}</div>
          <footer className="border-t border-gray-900/50 text-xs text-gray-500 py-6 mt-10 px-6">
            <div className="max-w-6xl mx-auto">© {new Date().getFullYear()} SaaS Analytics</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
