import { ThemeProvider } from "@/components/ui/theme-provider";
import Providers from "@/store/StoreProvider";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

import localFont from "next/font/local";
const openhours = localFont({
  src: "../../public/fonts/OpeningHoursSans-Regular.woff2",
});

export const metadata: Metadata = {
  title: "Oraca",
  description: "AI supercharged SQL tool. Visualisations, Query Generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${openhours.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 z-[-1] h-full w-full object-cover"
            src="/bg.webm"
          ></video>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
