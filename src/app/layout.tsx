import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:"Dashboard de biblioteca",
  description: "Sistema de reportes bibliotecarios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="flex h-screen overflow-hidden text-slate-600 font-sans">

        <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col min-w-0">

            {/* HEADER */}
            <header className="flex justify-between items-center px-8 py-5 flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-[#2E5AA7]">Biblioteca</span>
              </div>
            </header>

            {/* PAGE CONTENT */}
            <div className="flex-1 overflow-y-auto relative px-8 pb-8">
              {children}
            </div>
        </main>
      </body>
    </html>
  );
}