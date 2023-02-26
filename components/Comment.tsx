/* eslint-disable @next/next/no-img-element */
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { getTimeFromDate } from "lib/date.helper";
import Link from "next/link";

import { Noto_Sans_Mono } from "@next/font/google";
import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const NotoMono = Noto_Sans_Mono({
    weight: "400",
    style: ["normal"],
    subsets: ["latin"],
});

type Props = {
    comment: Comment;
};

export default function Comment({ comment }: Props) {
    return (
        <div className="w-full flex items-center justify-start space-x-1 py-1">
            <div className="flex flex-col items-center justify-center">
                {comment.user.avatar ? (
                    <img
                        src={"/avatars/" + comment.user.avatar}
                        alt={comment.user.username}
                        className="w-9 h-9 rounded-full"
                    />
                ) : (
                    <UserCircleIcon className="w-9 h-9 text-neutral-500" />
                )}
            </div>
            <div className="flex flex-col items-start justify-center">
                <div className="flex items-center justify-start">
                    <Link
                        href={`/user/${comment.user.username}`}
                        className="font-medium text-sm hover:underline underline-offset-1"
                    >
                        {comment.user.username}
                    </Link>
                    <p className="text-xl font-bold text-neutral-500 pl-1 -mr-1">
                        ·
                    </p>
                    <p className="text-sm text-neutral-500 ml-2">
                        {getTimeFromDate(comment.created_at)}
                    </p>
                </div>
                <p className="text-md text-neutral-50">{comment.body}</p>
            </div>
        </div>
    );
}

type InputProps = {
    post: Post;
    setPosts: Dispatch<SetStateAction<Post[]>>;
};

Comment.Input = function CommentInput({ post, setPosts }: InputProps) {
    const [hovered, setHovered] = useState(false);
    const [comment, setComment] = useState("");
    const { data: session } = useSession();

    const handleComment = async () => {
        if (session) {
            await axios
                .post(`http://localhost:8080/comments`, {
                    content: comment,
                    author: session?.user.id!,
                    postId: post.id,
                })
                .then((res) => {
                    const newPost = post;
                    newPost.comments.push(res.data);

                    setPosts((prev) => {
                        const newPosts = prev;
                        const index = newPosts.findIndex(
                            (p) => p.id === newPost.id
                        );
                        newPosts[index] = newPost;
                        return newPosts;
                    });

                    setComment("");

                    toast.success("Comment sent!");
                })
                .catch((err) => {
                    toast.error("Something went wrong!");
                    console.log(err);
                });
        } else {
            toast.error("You need to be logged in to comment!");
        }
    };

    return (
        <div className="w-full pr-12 py-2 flex items-start justify-start">
            <main className="w-full flex flex-col items-center justify-center">
                <textarea
                    name="comment"
                    id="comment"
                    rows={4}
                    onMouseOver={() => {
                        setHovered(true);
                    }}
                    onMouseLeave={() => {
                        setHovered(false);
                    }}
                    onChange={(e) => {
                        setComment(e.target.value);
                    }}
                    style={NotoMono.style}
                    placeholder="What are your thoughts?"
                    className="p-2 bg-transparent rounded-t-md outline-none text-sm w-full text-neutral-50 border-x-2 border-t-2 border-neutral-700/50 hover:border-blue-500 transition duration-300"
                ></textarea>
                <div
                    className={`flex items-center justify-end border-b-2 border-x-2  bg-neutral-800 w-full rounded-b-md p-1 transition-all duration-300 ${
                        hovered ? "border-blue-500" : "border-transparent"
                    }`}
                >
                    <button
                        onClick={async () => {
                            await handleComment();
                        }}
                        className="bg-blue-500 text-neutral-50 font-semibold px-4 py-0.5 text-sm rounded-2xl"
                    >
                        Comment
                    </button>
                </div>
            </main>
        </div>
    );
};
