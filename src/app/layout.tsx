import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Exam Card System - SMK Ekonomika",
  description:
    "Sistem Kartu Ujian SMK Ekonomika",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}