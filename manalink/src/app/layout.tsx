import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>ManaLink</title>
      </head>
      <body className="flex min-h-screen flex-col justify-center font-robotoMono h-screen">{children}</body>
    </html>
  );
}
