import { Poppins, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex",
});

export const metadata = {
  title: "LINKO",
  description: "A B2B marketplace connecting businesses with verified service providers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${ibmPlexSans.variable}`}>
      <body className="min-h-screen bg-canvas font-body text-ink antialiased">{children}</body>
    </html>
  );
}
