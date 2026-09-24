export const metadata = {
  title: "Comité Digital Dashboard",
  description: "Dashboard de métricas digitales en vivo: GSC, GA4, Meta",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", backgroundColor: "#f5f5f5" }}>
        {children}
      </body>
    </html>
  );
}
