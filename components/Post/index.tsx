/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import useUser from "hooks/useUser";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import Panel from "./components/Panel";

type Props = {
    post: Post;
    setPosts: Dispatch<SetStateAction<Post[] | undefined | null>>;
    index: number;
    setCurrentPost: Dispatch<SetStateAction<Post | null>>;
    setPostOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Post({
    post,
    setPosts,
    index,
    setCurrentPost,
    setPostOpen,
}: Props) {
    const { user } = useUser(post.authorId);

    const postRef = useRef(null);

    const [hovered, setHovered] = useState(false);

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
            <Panel.Left
                post={post}
                postRef={postRef}
                hovered={hovered}
                setPosts={setPosts}
            />
            <section
                ref={postRef}
                className="flex flex-1 flex-col text-left items-start justify-center space-y-3 after:text-neutral-300 h-fit w-full"
            >
                <Panel.Main
                    post={post}
                    user={user}
                    setCurrentPost={setCurrentPost}
                    setPostOpen={setPostOpen}
                />
                <Panel.Bottom
                    setCurrentPost={setCurrentPost}
                    setPostOpen={setPostOpen}
                    post={post}
                />
            </section>
        </motion.div>
    );
}
