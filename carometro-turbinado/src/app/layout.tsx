import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { UserContextProvider } from "@/contexts/UserContext";

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
    <UserContextProvider>
      <html lang="pt-br">
        <body className={`h-screen flex flex-col ${poppins.className}`}>
          {children}
        </body>
      </html>
    </UserContextProvider>
  );
}
