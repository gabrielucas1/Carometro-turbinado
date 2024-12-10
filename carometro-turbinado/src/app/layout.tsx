import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { UserContextProvider } from "@/contexts/UserContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "700"], // Especifique o(s) peso(s) desejado(s) aqui
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"], // Especifique os pesos que você usará
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
    <UserContextProvider>
      <html lang="pt-br">
        <body className={`h-screen flex flex-col ${poppins.className}`}>
          {children}
        </body>
      </html>
    </UserContextProvider>
  );
}
