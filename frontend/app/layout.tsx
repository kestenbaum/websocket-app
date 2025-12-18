import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat",
  description: "websocket chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          <header className="h-15 border-b border-gray-200 w-full fixed">
              <div className="flex items-center max-w-5xl mx-auto pr-5 pl-5 h-full">
                  <h1>WebSocket</h1>
              </div>
          </header>
          <section className="max-w-5xl mx-auto pr-5 pl-5">
              {children}
          </section>
      </body>
    </html>
  );
}
