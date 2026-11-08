import { Anton, Archivo, JetBrains_Mono, Newsreader } from "next/font/google";

// Máximo tres familias (DESIGN.md §4). Todas se sirven desde el propio dominio.

// Títulos gigantes. Variable: peso 100–900 y eje de ancho (wdth 62–125 %),
// que permite comprimir el nombre del Hero con font-stretch.
export const fontDisplay = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

// Subtítulos en serif cursiva. Solo se descarga el estilo italic.
export const fontSerif = Newsreader({
  subsets: ["latin"],
  style: "italic",
  variable: "--font-newsreader",
  display: "swap",
});

// Metadatos, etiquetas, filtros y botones.
export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const fontVariables = `${fontDisplay.variable} ${fontSerif.variable} ${fontMono.variable}`;

// Excepción documentada (DESIGN.md §4): solo para las palabras del preloader.
// Su variable se aplica en la capa del preloader, no en <html>, así que la
// landing no la usa nunca.
export const fontPreloader = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});
