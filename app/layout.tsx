import { Poppins, IBM_Plex_Sans, Tajawal, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  variable: "--font-poppins",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex",
});

const tajawalArabic = Tajawal({
  subsets: ["arabic"],
  weight: ["800", "900"],
  variable: "--font-ar-heading",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
});

export const metadata = {
  title: "LINKO",
  description: "A B2B marketplace connecting businesses with verified service providers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${ibmPlexSans.variable} ${tajawalArabic.variable} ${ibmPlexSansArabic.variable}`}
    >
      <body className="min-h-screen bg-canvas font-body text-ink antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
