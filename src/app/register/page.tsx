"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";

type Props = {};

export default function Page({}: Props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const signUp = async () => {
        const res = axios
            .post("http://192.168.1.3:8080/api/signup", {
                username,
                password,
                email,
                firstName,
                lastName,
            })
            .then((res) => {
                if (res.status === 200) {
                    signIn("credentials", {
                        redirect: true,
                        username,
                        password,
                        callbackUrl: "/",
                    });
                } else {
                    toast.error("Something went wrong");
                }
            })
            .catch((err) => {
                toast.error(
                    err.message + ": User with that username already exists"
                );
            });
    };

    return (
        <section className="flex flex-col items-center justify-center w-screen h-screen bg-gradient-to-tr from-blue-600 via-pink-600 to-amber-500">
            <div className="flex flex-col items-center justify-center gap-4 px-3 py-12 border border-white/30 rounded-xl w-11/12 md:w-1/2 2xl:w-[25vw] bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm shadow-[5px_5px_50px_10px] shadow-black/20">
                <div className="w-1/2 flex flex-col items-start justify-start gap-3">
                    <h1 className="text-4xl font-bold text-white">
                        Register Form
                    </h1>
                    <div className="w-1/3 bg-neutral-50 h-1" />
                </div>
                <div className="flex items-center justify-center gap-4 w-full">
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-neutral-50 bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg px-2 py-1 focus:outline-none placeholder-neutral-100 text-neutral-50 font-medium text-xl w-3/4 md:w-1/2 shadow-[5px_5px_50px_5px] shadow-black/20 border border-white/20"
                        placeholder="First Name"
                    />
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="bg-neutral-50 bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg px-2 py-1 focus:outline-none placeholder-neutral-100 text-neutral-50 font-medium text-xl w-3/4 md:w-1/2 shadow-[5px_5px_50px_5px] shadow-black/20 border border-white/20"
                        placeholder="Last Name"
                    />
                </div>
                <div className="flex items-center justify-center gap-4 w-full">
                    <input
                        type="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-neutral-50 bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg px-2 py-1 focus:outline-none placeholder-neutral-100 text-neutral-50 font-medium text-xl w-3/4 md:w-1/2 shadow-[5px_5px_50px_5px] shadow-black/20 border border-white/20"
                        placeholder="Username"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-neutral-50 bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg px-2 py-1 focus:outline-none placeholder-neutral-100 text-neutral-50 font-medium text-xl w-3/4 md:w-1/2 shadow-[5px_5px_50px_5px] shadow-black/20 border border-white/20"
                        placeholder="Email"
                    />
                </div>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-neutral-50 bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg px-2 py-1 focus:outline-none placeholder-neutral-100 text-neutral-50 font-medium text-xl w-full shadow-[5px_5px_50px_5px] shadow-black/20 border border-white/20"
                    placeholder="Password"
                />
                <button
                    onClick={async () => {
                        await signUp();
                    }}
                    className="py-1 px-12 text-xl font-semibold text-neutral-50 border-2 border-neutral-50 rounded-lg hover:bg-neutral-50 hover:text-neutral-900 transition duration-300"
                >
                    Login
                </button>
            </div>
        </section>
    );
}
