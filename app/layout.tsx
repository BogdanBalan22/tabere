import type { Metadata } from "next";
import { Geist } from "next/font/google";
import StructuredData from "./structured-data";
import "./site.css";
import { getSiteUrl } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();
const siteName = "Poli Summer Camp";
const title = {
  default: `${siteName} | Tabere copii UPB`,
  template: `%s | ${siteName}`,
};
const description =
  "Tabere urbane POLITEHNICA București pentru copii curioși: activități interactive, ateliere practice și înscriere online.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "Poli Summer Camp",
    "tabără copii București",
    "tabără UPB",
    "POLITEHNICA București copii",
    "tabără STEM copii",
    "înscriere tabără vară",
    "campus UPB",
    "activități copii 5-11 ani",
  ],
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: "Universitatea Națională de Știință și Tehnologie POLITEHNICA București",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      ro: "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "/",
    siteName,
    title: title.default,
    description,
    images: [
      {
        url: "/8.close-up-smiley-kids-team.jpg",
        width: 1200,
        height: 630,
        alt: "Copii la activități în cadrul Poli Summer Camp, campus POLITEHNICA București",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: title.default,
    description,
    images: ["/8.close-up-smiley-kids-team.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={geistSans.variable}>
      <body>
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
