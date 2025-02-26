import type { Metadata } from "next";
import localFont from "next/font/local"; 
import MapCRUDProvider from "@/app/redux/MapCRUDProvider";
import './styles/style.scss'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "DrawGeo", 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MapCRUDProvider>
        {children}
        </MapCRUDProvider>
      </body>
    </html>
  );
}
