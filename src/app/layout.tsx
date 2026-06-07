import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TheHalicQuotes – AI-Powered Motivational Quotes Platform",
  description: "Your personal daily motivation companion. Discover inspirational quotes, generate custom AI quotes, design wallpapers, create vision boards, and connect with your AI motivation coach.",
  keywords: [
    "motivational quotes",
    "inspirational quotes",
    "success quotes",
    "daily motivation",
    "leadership quotes",
    "positive quotes",
    "business quotes",
    "motivational quote generator",
    "AI quote generator",
    "quote wallpaper creator",
    "motivational sayings",
    "life quotes",
    "productivity quotes",
    "entrepreneur quotes",
    "personal development quotes"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
