/* eslint-disable @next/next/no-img-element */
"use client";

import {
    ArrowTopRightOnSquareIcon,
    ChevronUpIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import usePosts from "hooks/usePosts";
import useUser from "hooks/useUser";
import { getTimeFromDate } from "lib/date.helper";
import { shortenTheBigNumbers } from "lib/numbers.helper";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRef, useState } from "react";
import Image from "next/image";

type Props = {
    post: Post;
    setPosts: React.Dispatch<React.SetStateAction<Post[] | undefined | null>>;
    index: number;
};

export default function Post({ post, setPosts, index }: Props) {
    const { user, loading, error } = useUser(post.authorId);
    const { data: session } = useSession();
    const { updateSingleUpVote, removeSinglePost } = usePosts();

    const postRef = useRef(null);

    const [hovered, setHovered] = useState(false);

    const handleRemovePost = async (id: number) => {
        if (session) {
            setPosts((prev) => {
                const newPosts = prev?.filter((post) => post.id != id);
                return newPosts;
            });
            await removeSinglePost(post, session.user.id.toString());
        }
    };

    const handleUpVote = () => {
        // check if the user already upvoted
        // if not then add the user to the upvotes array
        // if yes then remove the user from the upvotes array
        if (session) {
            const userAlreadyUpvoted = post.upvotes.find(
                (upvote) => upvote == session.user.id.toString()
            );

            if (userAlreadyUpvoted) {
                // remove the user from the upvotes array
                const newUpvotes = post.upvotes.filter(
                    (upvote) => upvote != session.user.id.toString()
                );

                post.upvotes = newUpvotes;
                setPosts((prev) => {
                    const newPosts = prev?.map((p) => {
                        if (p.id == post.id) {
                            return post;
                        }
                        return p;
                    });
                    return newPosts;
                });
                updateSingleUpVote(post, "remove", session.user.id.toString());
            } else {
                // add the user to the upvotes array
                post.upvotes = [...post.upvotes, session.user.id.toString()];
                setPosts((prev) => {
                    const newPosts = prev?.map((p) => {
                        if (p.id == post.id) {
                            return post;
                        }
                        return p;
                    });
                    return newPosts;
                });
                updateSingleUpVote(post, "add", session.user.id.toString());
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -200 }}
            animate={{
                opacity: 1,
                x: 0,
                transition: {
                    delay: 0.1 * index,
                    duration: 0.75,
                    type: "spring",
                    bounce: 0.5,
                },
            }}
            exit={{
                opacity: 0,
                x: 400,
                transition: { duration: 0.3, ease: "easeInOut" },
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="w-full flex items-center justify-center gap-2"
        >
            <section
                className="self-stretch h-full flex flex-col items-center justify-between"
                style={{
                    //@ts-ignore
                    height: postRef.current?.clientHeight,
                }}
            >
                <div className="px-2 py-4 h-fit flex flex-col items-center justify-start bg-neutral-50 rounded-xl">
                    <button
                        onClick={() => {
                            handleUpVote();
                        }}
                    >
                        {/* display: <ChevronUpIcon
                        className="w-6 h-6"
                        style={{ transform: "rotateY(180deg)" }}
                    />
                    but if the session.user has upvoted the post then change the text color to orange-500 */}
                        <ChevronUpIcon
                            className={`w-7 h-7 ${
                                session &&
                                post.upvotes.find(
                                    (upvote) =>
                                        upvote == session.user.id.toString()
                                )
                                    ? "text-orange-500"
                                    : "text-neutral-900"
                            }`}
                        />
                    </button>
                    <p
                        className={`font-bold ${
                            session &&
                            post.upvotes.find(
                                (upvote) => upvote == session.user.id.toString()
                            )
                                ? "text-orange-500"
                                : "text-neutral-900"
                        }`}
                    >
                        {shortenTheBigNumbers(post.upvotes.length)}
                    </p>
                    <button>
                        <ChevronUpIcon className="w-6 h-6 transform rotate-180" />
                    </button>
                </div>
                {post.authorId == session?.user.id && hovered && (
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-2 h-fit flex flex-col items-center justify-start bg-neutral-50 rounded-xl text-neutral-500 hover:text-red-500 transition duration-300"
                        >
                            <button
                                onClick={async () => {
                                    await handleRemovePost(post.id);
                                }}
                            >
                                <TrashIcon className="w-7 h-7" />
                            </button>
                        </motion.div>
                    </AnimatePresence>
                )}
            </section>
            <button
                onClick={() => {
                    window.location.href = `/post/${post.id}`;
                }}
                ref={postRef}
                className="flex flex-1 flex-col text-left items-start justify-center gap-2 bg-neutral-50 rounded-xl p-4 after:text-neutral-300 h-fit w-full"
            >
                <div className="w-full px-2 flex items-center justify-between">
                    <div className="flex items-center justify-center gap-2">
                        <p className="font-bold">u/{user?.username}</p>
                        <p className="text-neutral-400 font-medium text-sm">
                            Posted {getTimeFromDate(post.created_at)}
                        </p>
                    </div>
                    <p className="px-3 py-0.5 rounded-3xl bg-blue-500 text-neutral-50 font-medium hidden md:block">
                        Open
                    </p>
                </div>
                <h1 className="text-lg xl:text-xl font-semibold xl:font-medium">
                    {post.title}
                </h1>
                {post.body && (
                    <p className="text-sm md:text-base">
                        {post.body.length > 350 ? (
                            <span>
                                {post.body.substring(0, 350)}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-black/90 to-transparent">
                                    {post.body.substring(350, 400)}
                                </span>
                            </span>
                        ) : (
                            post.body
                        )}
                    </p>
                )}
                {post.link && (
                    <Link
                        target="_blank"
                        href={post.link}
                        className="text-blue-500 font-medium flex items-center justify-center gap-1 hover:underline transition duration-200 py-3"
                    >
                        {/* format the link from https://link.com or http://link.com or https://www.link.com or http://www.link.com to link.com */}
                        {
                            post.link
                                .replace("https://", "")
                                .replace("http://", "")
                                .replace("www.", "")
                                .split("/")[0]
                        }
                        <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                    </Link>
                )}
                {post.imageName && (
                    <>
                        <img
                            src={`/postImages/${post.imageName}`}
                            alt={post.imageName}
                            className="w-full xs:w-5/6  sm:w-2/3 h-auto rounded-xl self-center"
                        />
                    </>
                )}
            </button>
        </motion.div>
    );
}
