import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Speaklablingo",
  description: "Práctica diaria de idiomas de SpeakLab",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "Lingo" },
};

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-100`}
      >
        {/* Phone-width frame (iPhone Pro Max = 430px) so desktop dev matches mobile. */}
        <main className="mx-auto flex min-h-dvh max-w-[430px] flex-col bg-white text-neutral-900">
          {children}
        </main>
      </body>
    </html>
  );
}
