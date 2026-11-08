import { Chakra_Petch, JetBrains_Mono } from "next/font/google";

// Títulos. Chakra Petch no es variable: hay que indicar los pesos.
export const fontDisplay = Chakra_Petch({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-chakra",
  display: "swap",
});

// Detalles (etiquetas, código, metadatos).
export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const fontVariables = `${fontDisplay.variable} ${fontMono.variable}`;
