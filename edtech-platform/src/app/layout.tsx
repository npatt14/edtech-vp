import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { VideoProvider } from "@/context/VideoContext";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduStream - Educational Video Platform",
  description: "Watch, create, and interact with educational videos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white min-h-screen`}>
        <VideoProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <footer className="bg-[#00171F] text-white py-8">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <span className="text-xl font-bold text-[#007EA7]">
                      EduStream
                    </span>
                    <p className="text-sm text-gray-400 mt-1">
                      Expanding minds through educational content
                    </p>
                  </div>
                  <div className="text-sm text-gray-400">
                    © {new Date().getFullYear()} EduStream. All rights reserved.
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
