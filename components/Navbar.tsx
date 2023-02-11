"use client";

import { motion } from "framer-motion";

import Image from "next/image";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

type Props = {};

export default function Navbar({}: Props) {
    const { data: session } = useSession();
    return (
        <nav className="sticky top-0 left-0 flex items-center justify-evenly w-screen py-1.5 bg-neutral-100">
            <div className="flex items-center justify-center gap-2">
                <Image
                    src="/logo.png"
                    alt="Nexitt Logo"
                    width={30}
                    height={30}
                    className="rounded-full"
                />
                <a href="/" className="hidden md:block text-2xl font-semibold">
                    Nexitt
                </a>
            </div>
            <div className="w-1/2 flex items-center justify-center border border-neutral-300/70 bg-neutral-200/70 rounded-full">
                <label htmlFor="search">
                    <MagnifyingGlassIcon className="w-10 h-10 p-2" />
                </label>
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search Nexitt"
                    className="w-full p-2 rounded-full outline-none font-medium bg-transparent"
                />
            </div>
            <motion.a
                href={session?.user ? "/account" : "/login"}
                whileHover={{
                    scale: 1.1,
                    transition: {
                        duration: 0.2,
                    },
                }}
                className="px-4 md:px-10 py-1.5 text-md font-semibold text-neutral-50 bg-blue-500 rounded-3xl"
            >
                {session?.user ? "Account" : "Log In"}
            </motion.a>
        </nav>
    );
}
