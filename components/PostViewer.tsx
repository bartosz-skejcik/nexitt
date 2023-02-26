/* eslint-disable @next/next/no-img-element */
import { Dialog, Transition } from "@headlessui/react";
import {
    ChatBubbleBottomCenterIcon,
    ShareIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import useUser from "hooks/useUser";
import { getTimeFromDate } from "lib/date.helper";
import { shortenTheBigNumbers } from "lib/numbers.helper";
import Link from "next/link";
import { Fragment, useState } from "react";
import Comment from "./Comment";
import Panel from "./Post/components/Panel";

const Content = ({ post }: { post: Post }) => {
    if (post.body) {
        return (
            <div className="pl-2 py-1 text-md border-l-2 border-neutral-300/50 text-neutral-200">
                {post.body}
            </div>
        );
    } else if (post.link) {
        return (
            <div className="pl-2 py-1 text-md border-l-2 border-neutral-300/50 text-neutral-200">
                {post.link}
            </div>
        );
    } else if (post.imageName) {
        return (
            <img
                src={"/postImages/" + post?.imageName}
                alt={post?.title}
                className="w-3/4 rounded-lg opacity-90 self-center my-6"
            />
        );
    } else {
        return <div className="text-neutral-50">Something went wrong</div>;
    }
};

type Props = {
    postOpen: boolean;
    setPostOpen: any;
    currentPost: Post | null;
    setPosts: any;
};

export default function PostViewer({
    postOpen,
    setPostOpen,
    currentPost,
    setPosts,
}: Props) {
    const { user } = useUser(currentPost?.authorId!);

    // sort the comments by date
    const sortedComments = currentPost?.comments.sort(
        (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return (
        <Transition appear show={postOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                onClose={() => {
                    setPostOpen(false);
                }}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-80" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="flex space-x-2 items-start text-left justify-start space-y-5 w-full md:w-3/4 lg:w-2/3 h-full py-5 px-2 rounded-xl bg-neutral-900 overflow-y-auto">
                                <Panel.Left
                                    post={currentPost!}
                                    setPosts={setPosts}
                                />
                                <main className="flex flex-col items-start justify-start space-y-5 w-full flex-1">
                                    <Dialog.Title
                                        as="div"
                                        className="flex flex-col items-start justify-center space-y-2 text-neutral-100"
                                    >
                                        <div className="flex items-center justify-center space-x-1 text-sm ">
                                            <div className="flex items-center justify-center space-x-1">
                                                {user?.avatar ? (
                                                    <img
                                                        src={
                                                            "/avatars/" +
                                                            user?.avatar
                                                        }
                                                        alt={user?.full_name}
                                                        className="w-6 h-6 rounded-full"
                                                    />
                                                ) : (
                                                    <UserCircleIcon className="w-6 h-6" />
                                                )}
                                                <p className="font-semibold">
                                                    u/{user?.username}
                                                </p>
                                            </div>
                                            <p className="text-neutral-400">
                                                Posted{" "}
                                                {getTimeFromDate(
                                                    currentPost?.created_at!
                                                )}
                                            </p>
                                        </div>
                                        <h2 className="text-xl md:text-[1.4rem] font-medium">
                                            {currentPost?.title}
                                        </h2>
                                    </Dialog.Title>
                                    <Content post={currentPost!} />
                                    <div className="flex items-center justify-start w-5/6 gap-3 text-neutral-400">
                                        <div className="flex items-center justify-center gap-1">
                                            <ChatBubbleBottomCenterIcon className="w-6 h-6" />
                                            <div className="font-medium text-sm gap-1 flex items-center justify-center">
                                                <span>
                                                    {currentPost?.comments
                                                        ? shortenTheBigNumbers(
                                                              currentPost
                                                                  ?.comments
                                                                  .length
                                                          )
                                                        : 0}
                                                </span>
                                                <span>Comments</span>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/posts/${currentPost?.id}`}
                                            className="flex items-center justify-center gap-2"
                                        >
                                            <ShareIcon className="w-5 h-5" />
                                            <p className="font-medium text-sm">
                                                Share
                                            </p>
                                        </Link>
                                    </div>
                                    <Comment.Input
                                        post={currentPost!}
                                        setPosts={setPosts}
                                    />
                                    <div className="flex flex-col items-start justify-start w-full -ml-6 text-neutral-200">
                                        {sortedComments?.map((comment) => (
                                            <Comment
                                                key={comment.id}
                                                comment={comment}
                                            />
                                        ))}
                                    </div>
                                </main>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
