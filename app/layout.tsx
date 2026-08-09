import { Poppins, IBM_Plex_Sans, Tajawal, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { SiteFooter } from "@/components/SiteFooter";

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
      <body className="flex min-h-screen flex-col bg-canvas font-body text-ink antialiased">
        <LanguageProvider>
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
