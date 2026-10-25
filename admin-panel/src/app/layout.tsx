import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Califnco Admin Panel | Operations & Dealer Service Desk",
  description: "Enterprise Operations Console for Califnco Water Technologies. Order management, dealer approvals, and technician dispatch.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className={`${inter.className} min-h-full bg-slate-950 text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
