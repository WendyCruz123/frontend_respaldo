import "@/styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";
export const metadata: Metadata = {
  title: "Sistema de Gestión de Archivos - POSGRADO",
  description: "Plataforma para subir, consultar y visualizar archivos PDF de usuarios.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={clsx("font-sans antialiased", fontSans.className)}>
        
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
