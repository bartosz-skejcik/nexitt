/* eslint-disable @next/next/no-img-element */
"use client";

import { Post, Navbar, Filters, Create } from "components";
import { AnimatePresence } from "framer-motion";
import usePosts from "hooks/usePosts";
import { sortPostsByDate, sortPostsByUpVotes } from "lib/date.helper";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
    const [filter, setFilter] = useState("best");

    const { data: session } = useSession();
    const { posts, setPosts, loading, error } = usePosts();

    const filteredPosts =
        filter == "best"
            ? posts && sortPostsByUpVotes(posts)
            : posts && sortPostsByDate(posts);

    return (
        <section className="flex flex-col items-center justify-start w-screen min-h-screen bg-gradient-to-tr from-blue-600 via-pink-600 to-amber-500">
            <Navbar />
            <section className="w-screen flex items-center justify-start flex-col gap-5 py-5">
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
