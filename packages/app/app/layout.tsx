import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "react-toastify/dist/ReactToastify.css";
import type {Metadata} from "next";
import {Manrope} from "next/font/google";
import {ToastContainer} from "react-toastify";
import Image from "next/image";
import Bg from "~/bg_.png";

const manrope = Manrope({subsets: ["latin"]});
export const metadata: Metadata = {
    title: "CoM",
    description:
        "Cross chain peer to peer bridge",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={manrope.className + ' relative'}>
        <div className="fixed -z-10 inset-0 bg-gradient-to-t from-purple-500 to-pink-500 font-semibold">
            <Image src={Bg} alt={''} className='absolute left-0 top-0 h-full object-cover'/>
        </div>
        <div
            className='-z-10 fixed inset-0 min-h-screen'></div>

        {children}
        <ToastContainer/>
        </body>
        </html>
    );
}
