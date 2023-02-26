/* eslint-disable @next/next/no-img-element */
"use client";

import { Post, Navbar, Filters, Create, PostViewer } from "components";
import { AnimatePresence } from "framer-motion";
import usePosts from "hooks/usePosts";
import {
    sortPostsByDate,
    sortPostsByUpVotes,
    sortPostsByComments,
} from "lib/sort.helper";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
    const [filter, setFilter] = useState("best");

    const { data: session } = useSession();
    const { posts, setPosts } = usePosts();

    const [currentPost, setCurrentPost] = useState<Post | null>(null);
    const [postOpen, setPostOpen] = useState(false);

    const filteredPosts =
        filter == "best"
            ? posts && sortPostsByUpVotes(posts)
            : filter == "new"
            ? posts && sortPostsByDate(posts)
            : posts && sortPostsByComments(posts);

    return (
        <section
            className="flex flex-col items-center justify-start w-screen min-h-screen"
            style={{
                backgroundImage: "linear-gradient(90deg, #000046, #1CB5E0)",
            }}
        >
            <Navbar />
            <section className="w-screen flex items-center justify-start flex-col gap-5 py-5">
                <PostViewer
                    postOpen={postOpen}
                    setPostOpen={setPostOpen}
                    currentPost={currentPost}
                    setPosts={setPosts}
                />
                <main className="w-11/12 md:w-2/3 lg:w-1/2 xl:w-[40%] gap-5 flex flex-col items-center justify-start">
                    <Create />
                    <Filters
                        filterOption={filter}
                        setFilterOption={setFilter}
                    />
                    <AnimatePresence>
                        {filteredPosts &&
                            filteredPosts.map((post: any, index: number) => (
                                <Post
                                    key={post.id}
                                    post={post}
                                    setPosts={setPosts}
                                    index={index}
                                    setCurrentPost={setCurrentPost}
                                    setPostOpen={setPostOpen}
                                />
                            ))}
                    </AnimatePresence>
                </main>
            </section>
            {session?.user ? (
                <button
                    onClick={() => {
                        signOut();
                    }}
                >
                    Sign Out
                </button>
            ) : (
                <a href="/login">Sign In</a>
            )}
        </section>
    );
}
