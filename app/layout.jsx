import { Montserrat, Lexend_Deca, Inter, Jost } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import SmoothScroller from "@/components/SmoothScroller";
import ErrorHandler from "@/components/ErrorHandler";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const lexend = Lexend_Deca({
  variable: "--font-lexend",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata = {
  title: "Stackup",
  description: "Stackup is the best software training institution offering comprehensive courses with dedicated placement support for all. Join the #1 tech training institute to build real skills and secure your career.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${lexend.variable} ${inter.variable} ${jost.variable} antialiased`}
      >
        <StoreProvider>
          <ThemeProvider attribute="class">
            <ErrorHandler>
              <SmoothScroller />
              {children}
              <Toaster />
            </ErrorHandler>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
