import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BiblioTech Dashboard",
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

        {/* CONTENIDO PRINCIPAL - Ahora ocupa todo el ancho */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col min-w-0">
          <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] h-full shadow-xl flex flex-col relative overflow-hidden border border-white/50">

            {/* HEADER */}
            <header className="flex justify-between items-center px-8 py-5 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2E5AA7] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#2E5AA7]/30">B</div>
                <span className="text-xl font-bold text-[#2E5AA7]">BiblioTech</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F8E6A0] border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
                  <span className="text-sm font-bold text-[#2E5AA7]">U</span>
                </div>
              </div>
            </header>

            {/* PAGE CONTENT */}
            <div className="flex-1 overflow-y-auto relative px-8 pb-8">
              {children}
            </div>

          </div>
        </main>
      </body>
    </html>
  );
}