import type { Metadata } from "next";
import { Inter, Syne, Syncopate } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import SiteShell from "@/components/layout/SiteShell";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const syne = Syne({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["700", "800"],
});
const syncopate = Syncopate({
  variable: "--font-syncopate",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "CORASE | RITUAL Streetwear",
  description: "Limited-drop DRIP, DETAIL, DOMINANCE for the bold and the restless. Archive quality, cinematic design.",
  keywords: ["streetwear", "premium tees", "limited drops", "CORASE", "RITUAL"],
  openGraph: {
    title: "CORASE | RITUAL Streetwear",
    description: "Limited-drop DRIP, DETAIL, DOMINANCE for the bold and the restless.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable} ${syncopate.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <WishlistProvider>
              <CartProvider>
                <div className="grain-overlay" />
                <SiteShell>{children}</SiteShell>
              </CartProvider>
            </WishlistProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
