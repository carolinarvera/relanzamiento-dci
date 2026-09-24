export const metadata = {
  title: "Comité Digital Dashboard",
  description: "Dashboard de métricas digitales en vivo: GSC, GA4, Meta",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Rubik:wght@400;500;600&family=Playfair+Display:wght@500;700;800&family=Montserrat:wght@400;500;600&display=swap"
        />
      </head>
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", backgroundColor: "#f5f5f5" }}>
        {children}
      </body>
    </html>
  );
}
