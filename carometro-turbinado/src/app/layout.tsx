import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "700"], // Especifique o(s) peso(s) desejado(s) aqui
});

export const metadata: Metadata = {
  title: "Carômetro Turbinado",
  description: "Software para gestão de alunos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`h-screen ${poppins.className}`}>{children}</body>
    </html>
  );
}
