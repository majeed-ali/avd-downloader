import { League_Spartan, Inter } from "next/font/google";


export const league_spartan_init = League_Spartan({
  subsets: ["latin"],
  variable: "--font-league_spartan_sans",
  weight: ["400", "500", "600", "700"]
})

export const inter_init = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"]
})

export const league_spartan_sans = league_spartan_init.variable
export const inter_sans = inter_init.variable