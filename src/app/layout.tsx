"use client";

import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import { IBM_Plex_Sans } from "@next/font/google";

const font = IBM_Plex_Sans({
    weight: ["400", "500", "600", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
});

export default function RootLayout({
    children,
    session,
}: {
    children: React.ReactNode;
    session: any;
}) {
    return (
        <html lang="en">
            {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
            <head />
            <body
                style={{
                    overflowX: "hidden",
                }}
                className={font.className}
            >
                <SessionProvider session={session}>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        pauseOnHover
                        theme="light"
                    />
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}
