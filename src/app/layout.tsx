import "./globals.css";

export const metadata = {
  title: "AI Image Generator",
  description: "Generate AI images from prompts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}