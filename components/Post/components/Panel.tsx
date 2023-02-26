/* eslint-disable @next/next/no-img-element */
import {
    ArrowTopRightOnSquareIcon,
    ChatBubbleBottomCenterIcon,
    ChevronUpIcon,
    ShareIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import usePosts from "hooks/usePosts";
import { getTimeFromDate } from "lib/date.helper";
import { shortenTheBigNumbers } from "lib/numbers.helper";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

type Props = {};

export default function Panel({}: Props) {
    return null;
}

type LeftProps = {
    post: Post;
    hovered?: boolean;
    postRef?: any;
    setPosts: Dispatch<SetStateAction<Post[] | undefined | null>>;
};

Panel.Left = function PanelLeft({
    post,
    hovered,
    postRef,
    setPosts,
}: LeftProps) {
    const { data: session } = useSession();
    const { updateSingleUpVote, removeSinglePost } = usePosts();

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
                (upvote) => upvote == session.user.id
            );

            if (userAlreadyUpvoted) {
                // remove the user from the upvotes array
                const newUpvotes = post.upvotes.filter(
                    (upvote) => upvote != session.user.id
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
                post.upvotes = [...post.upvotes, session.user.id];
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

    const handleDownVote = () => {
        // check if the user already upvoted
        // if not then dont do anything
        // if yes then remove the user from the upvotes array
        if (session) {
            const userAlreadyUpvoted = post.upvotes.find(
                (upvote) => upvote == session.user.id
            );

            if (userAlreadyUpvoted) {
                // remove the user from the upvotes array
                const newUpvotes = post.upvotes.filter(
                    (upvote) => upvote != session.user.id
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
            }
        }
    };

    return (
        <section
            className="self-stretch h-full flex flex-col items-center justify-between"
            style={{
                //@ts-ignore
                height: postRef ? postRef.current?.clientHeight : "100%",
            }}
        >
            <div className="px-2 py-4 h-fit flex flex-col items-center justify-start bg-neutral-900 rounded-xl">
                <button
                    onClick={() => {
                        handleUpVote();
                    }}
                >
                    <ChevronUpIcon
                        className={`w-7 h-7 ${
                            session &&
                            post.upvotes.find(
                                (upvote) => upvote == session.user.id
                            )
                                ? "text-orange-500"
                                : "text-neutral-50"
                        }`}
                    />
                </button>
                <p
                    className={`font-bold ${
                        session &&
                        post.upvotes.find((upvote) => upvote == session.user.id)
                            ? "text-orange-500"
                            : "text-neutral-50"
                    }`}
                >
                    {post.upvotes.length > 0 ? (
                        shortenTheBigNumbers(post.upvotes.length)
                    ) : (
                        <span className="font-semibold text-xs">Vote</span>
                    )}
                </p>
                <button
                    onClick={() => {
                        handleDownVote();
                    }}
                >
                    <ChevronUpIcon className="w-6 h-6 transform rotate-180 text-neutral-50" />
                </button>
            </div>
            {post.authorId == session?.user.id && hovered && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-2 h-fit flex flex-col items-center justify-start bg-neutral-900 rounded-xl text-neutral-500 hover:text-red-500 transition duration-300"
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
    );
};

type BottomProps = {
    post: Post;
    setPostOpen: any;
    setCurrentPost: any;
};

Panel.Bottom = function PanelBottom({
    post,
    setPostOpen,
    setCurrentPost,
}: BottomProps) {
    return (
        <div className="py-2.5 px-4 rounded-xl bg-neutral-900 text-neutral-300 gap-3 flex items-center justify-start w-full h-fit">
            <button
                onClick={() => {
                    setPostOpen(true);
                    setCurrentPost(post);
                }}
                className="flex items-center justify-center gap-1"
            >
                <ChatBubbleBottomCenterIcon className="w-6 h-6" />
                <div className="font-medium text-sm gap-1 flex items-center justify-center">
                    <span>
                        {post.comments
                            ? shortenTheBigNumbers(post.comments.length)
                            : 0}
                    </span>
                    <span>Comments</span>
                </div>
            </button>
            <Link
                href={`/posts/${post.id}`}
                className="flex items-center justify-center gap-2"
            >
                <ShareIcon className="w-5 h-5" />
                <p className="font-medium text-sm">Share</p>
            </Link>
        </div>
    );
};

type MainProps = {
    post: Post;
    user: User | undefined | null;
    setCurrentPost: (post: Post) => void;
    setPostOpen: (open: boolean) => void;
};

Panel.Main = function PanelMain({
    post,
    user,
    setCurrentPost,
    setPostOpen,
}: MainProps) {
    return (
        <button
            onClick={() => {
                setCurrentPost(post);
                setPostOpen(true);
            }}
            className="bg-neutral-900 rounded-xl p-4 flex-1 flex flex-col items-start justify-center gap-2 w-full h-fit"
        >
            <div className="w-full px-2 flex items-center justify-between">
                <div className="flex items-center justify-center gap-2">
                    <p className="font-bold text-neutral-100">
                        u/{user?.username}
                    </p>
                    <p className="text-neutral-400 font-medium text-sm">
                        Posted {getTimeFromDate(post.created_at)}
                    </p>
                </div>
                <p className="px-3 py-0.5 rounded-3xl bg-blue-500 text-neutral-50 font-medium hidden md:block">
                    Open
                </p>
            </div>
            <h1 className="text-lg xl:text-xl font-semibold xl:font-medium text-neutral-100 text-start">
                {post.title}
            </h1>
            {post.body && (
                <p className="text-sm md:text-base text-neutral-100 text-left">
                    {post.body.length > 250 ? (
                        <span>
                            {post.body.substring(0, 250)}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-100/90 to-neutral-900">
                                {post.body.substring(250, 300)}
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
                        className="w-full xs:w-5/6 sm:w-2/3 h-auto rounded-xl self-center opacity-90"
                    />
                </>
            )}
        </button>
    );
};
