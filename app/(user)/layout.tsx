import { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import React from "react";
import { Toaster } from "sonner";


const roboto = Roboto({
    variable: "--font-roboto",
    subsets: ["latin"]
})

const robotoMono = Roboto_Mono({
    variable: "--font-roboto-mono",
    subsets: ["latin"]
})

export const metadata: Metadata= {
    title: "Customer Page",
    description: ""
}
export default function UserLayout({children}: Readonly<{children: React.ReactNode}>) {
   return(<html>
     <body className={`${roboto.variable} ${robotoMono.variable}`}>
        <Toaster/>
        {children}
     </body>


   </html>) 
}