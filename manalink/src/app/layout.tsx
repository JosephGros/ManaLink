import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ManaLink",
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className="flex min-h-screen flex-col justify-center font-robotoMono h-screen bg-background">{children}</body>
    </html>
  );
}
