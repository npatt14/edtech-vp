import "./globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { VideoProvider } from "@/context/VideoContext";
import Header from "@/components/Header";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Feynman - Educational Video Platform",
  description: "Watch, create, and interact with educational videos",
  icons: {
    icon: "/book.png",
    apple: "/book.png",
    shortcut: "/book.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${nunito.className} bg-white min-h-screen`}
        suppressHydrationWarning={true}
      >
        <VideoProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <footer className="bg-[#00171F] text-white py-8">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <p className="text-sm text-gray-400 mt-1">
                      Expanding minds through educational content
                    </p>
                  </div>
                  <div className="text-sm text-gray-400">
                    © {new Date().getFullYear()}
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </VideoProvider>
      </body>
    </html>
  );
}
