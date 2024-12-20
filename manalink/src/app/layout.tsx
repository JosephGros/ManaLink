import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import useTokenAutoRefresh from "@/lib/autoTokenRefresh";

const APP_NAME = "ManaLink";
const APP_DEFAULT_TITLE = "ManaLink";
const APP_TITLE_TEMPLATE = "%s - ManaLink";
const APP_DESCRIPTION = "ManaLink is an application for Magic the Gathering players to easily plan game sessions with their playgroups.";

export const metadata: Metadata = {
  icons: [{ rel: "icon", url: "/favicon-16x16.png" }],
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#003135",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className="flex flex-col h-full min-h-screen bg-background font-robotoMono">
        <main className="flex-grow content-center mb-16 overflow-y-auto scroll-smooth">{children}</main>
        <Navbar />
      </body>
    </html>
  );
}
