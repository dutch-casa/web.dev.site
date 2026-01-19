import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree, Playfair_Display, JetBrains_Mono, EB_Garamond } from "next/font/google";
import "./globals.css";
import { SpeedDialNav } from "@/components/ui/speed-dial-nav";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600'],
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-eb-garamond',
  weight: ['400', '500', '600'],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "auweb.dev",
  description: "Learn Everything. Build Anything.",
  icons: {
    icon: "/Logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${figtree.variable} ${playfair.variable} ${ebGaramond.variable} overflow-x-hidden`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased overflow-x-hidden`}
      >
        {children}
        <div className="fixed bottom-8 right-8 z-50">
          <SpeedDialNav />
        </div>
      </body>
    </html>
  );
}
