import "./globals.css";

export const metadata = {
  title: "AWOS Products (Cliente)",
  description: "Cliente Next.js para consumir la AWOS (Products)"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <a href="/">Inicio</a>
          <a href="/products">Products</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
