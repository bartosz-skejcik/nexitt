"use client";

import {
    CheckIcon,
    ChevronRightIcon,
    LinkIcon,
    PhotoIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

type Props = {};

export default function Create({}: Props) {
    const { data: session } = useSession();
    const [step, setStep] = useState<"input" | "textarea" | "link" | "image">(
        "input"
    );

    const [buttonVisible, setButtonVisible] = useState(false);

    const [title, setTitle] = useState<string | null>(null);
    const [body, setBody] = useState<string | null>(null);
    const [link, setLink] = useState<string | null>(null);
    const [image, setImage] = useState<any>(null);
    const [imageName, setImageName] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async () => {
        if (image) {
            const formData = new FormData();
            formData.append("file", image);

            return await axios
                .post("http://192.168.1.3:8080/upload", formData)
                .then((res) => {
                    console.log(res);
                    return res.data.filename;
                })
                .catch((err) => {
                    toast.error("Something went wrong!");
                    console.log(err);
                });
        } else {
            return null;
        }
    };

    const handleSumbit = async () => {
        // validate the title field if is's not long enough
        if (title && title.length > 300) {
            toast.error("Title can not be longer than 300 characters!");
            setStep("input");
            inputRef.current?.focus();
            setButtonVisible(false);
            return;
        } else if (link && link.length > 0 && !link.includes("http")) {
            toast.error("Link must be a valid URL!");
            setStep("link");
            return;
        } else if (body && body.length < 10) {
            toast.error("Body must be at least 10 characters long!");
            setStep("textarea");
            return;
        } else if (image && image.size == 0) {
            toast.error("Image must be at least 1KB!");
            setStep("image");
            return;
        }

        await axios
            .post("http://192.168.1.3:8080/posts", {
                title:
                    title != null &&
                    title.replace(/\n+/g, "\\n").replace(/'+/g, "\\'"),
                content:
                    body != null
                        ? body.replace(/\n+/g, "\\n").replace(/'+/g, "\\'")
                        : null,
                author: session?.user.id,
                link: link != null ? link : null,
                imageName: await handleFileUpload(),
            })
            .then((res) => {
                toast.success("Post created successfully!");
            })
            .catch((err) => {
                toast.error("Something went wrong!");
                console.log(err);
            });

        setStep("input");
        setButtonVisible(false);
        setTitle(null);
        setBody(null);
    };

    return (
        <div
            className={`flex flex-col md:flex-row ${
                step != "input" ? "items-end" : "items-center"
            } justify-center w-full gap-4 py-2 px-4 bg-neutral-100 rounded-xl`}
        >
            <div className="flex items-center justify-center gap-2 w-full flex-1">
                {session?.user.avatar ? (
                    <Image
                        src={session?.user.avatar}
                        width={40}
                        height={40}
                        alt="avatar"
                        className="rounded-full self-start"
                    />
                ) : (
                    <div className="w-[40px] self-start aspect-square rounded-full bg-neutral-300/70 flex items-center justify-center">
                        <UserCircleIcon className="w-9 h-9 text-neutral-500" />
                    </div>
                )}
                <AnimatePresence initial>
                    {step === "input" && (
                        <motion.input
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            id="search"
                            type="text"
                            name="search"
                            ref={inputRef}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (e.target.value.length > 0) {
                                    setButtonVisible(true);
                                } else {
                                    setButtonVisible(false);
                                }
                            }}
                            placeholder="What's on your mind?"
                            className="w-full p-2 rounded-lg outline-none border border-neutral-300/70 bg-neutral-200/40"
                        />
                    )}
                    {step === "textarea" && (
                        <div className="flex flex-col items-start justify-center gap-1 w-full">
                            <h3 className="font-medium">
                                Title:{" "}
                                <span className="text-neutral-700">
                                    {title}
                                </span>
                            </h3>
                            <motion.textarea
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                id="body"
                                name="body"
                                placeholder="Can you elaborate?"
                                onChange={(e) => {
                                    setBody(e.target.value);
                                }}
                                className="w-full p-2 rounded-lg outline-none border border-neutral-300/70 bg-neutral-200/40"
                            />
                        </div>
                    )}
                    {step === "link" && (
                        <div className="flex flex-col items-start justify-center gap-1 w-full">
                            <h3 className="font-medium">
                                Title:{" "}
                                <span className="text-neutral-700">
                                    {title}
                                </span>
                            </h3>
                            <motion.input
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                id="link"
                                type="link"
                                name="link"
                                placeholder="Paste the link here..."
                                onChange={(e) => {
                                    setLink(e.target.value);
                                }}
                                className="w-full p-2 rounded-lg outline-none border border-neutral-300/70 bg-neutral-200/40"
                            />
                        </div>
                    )}
                    {step === "image" && (
                        <div className="flex flex-col items-start justify-center gap-1 w-fit flex-2 md:w-full">
                            <h3 className="font-medium">
                                Title:{" "}
                                <span className="text-neutral-700">
                                    {title}
                                </span>
                            </h3>
                            <motion.input
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="w-full p-2 rounded-lg outline-none border border-neutral-300/70 bg-neutral-200/40"
                                type="file"
                                name="file"
                                id="file"
                                accept="image/*"
                                onChange={(e) => {
                                    setImage(e.target.files![0]);
                                }}
                            />
                        </div>
                    )}
                </AnimatePresence>
            </div>
            <div className="flex items-center justify-center gap-2">
                <AnimatePresence initial>
                    {buttonVisible && (
                        <motion.button
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            onClick={async () => {
                                if (step === "input") {
                                    setStep("textarea");
                                } else {
                                    // submit
                                    await handleSumbit();
                                }
                            }}
                            className="p-1 flex items-center justify-center rounded-lg bg-blue-500 text-neutral-50"
                        >
                            {step === "input" ? (
                                <ChevronRightIcon className=" ml-0.5 w-6 h-6" />
                            ) : (
                                <CheckIcon className="w-6 h-6" />
                            )}
                        </motion.button>
                    )}
                </AnimatePresence>
                <button
                    onClick={() => {
                        // focus on the input
                        if (step == "input") {
                            inputRef.current?.focus();
                        } else {
                            if (step == "textarea") {
                                setStep("link");
                                setBody(null);
                            }
                        }
                    }}
                >
                    <LinkIcon
                        className={`p-1 w-8 h-8 ${
                            step == "textarea"
                                ? "text-blue-500"
                                : "text-neutral-500"
                        }`}
                    />
                </button>
                <button
                    onClick={() => {
                        // focus on the input
                        if (step == "input") {
                            inputRef.current?.focus();
                        } else {
                            if (step == "textarea") {
                                setStep("image");
                                setBody(null);
                            } else if (step == "link") {
                                setStep("image");
                                setLink(null);
                            }
                        }
                    }}
                >
                    <PhotoIcon
                        className={`p-1 w-8 h-8 ${
                            step == "textarea"
                                ? "text-blue-500"
                                : "text-neutral-500"
                        }`}
                    />
                </button>
            </div>
        </div>
    );
}
