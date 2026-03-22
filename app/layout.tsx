import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ background: "#0D0305", color: "white", margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}