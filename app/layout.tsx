import { Navbar } from "@/components/navbar";
import "./globals.css";
import { Manrope, Fraunces } from "next/font/google";
import { Footer } from "@/components/footer";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-serif" });

export const metadata = {
  title: "Cadical Solutions — Nigeria's healthcare supply partner",
  description:
    "Medical equipment, pharmaceuticals, and specialist services across Nigeria.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable}`}>
      <body className="bg-[#FBFAF7] text-[#1A1A18] font-sans">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}





// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { Navbar } from "@/components/navbar";
// import { Footer } from "@/components/footer";
// import { Toaster } from "sonner";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "cadical",
//   description: "cadical website",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <Navbar />
//         {children}
//          <Footer />
//          <Toaster />
//       </body>
//     </html>
//   );
// }
