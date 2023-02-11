import axios from "axios";
import { useEffect, useState } from "react";
import fs from "fs";

export default function usePosts() {
    const [posts, setPosts] = useState<Post[] | null>();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const updateSingleUpVote = (
        updatedPost: Post,
        operation: "add" | "remove",
        userId: string
    ) => {
        const updatedPosts = posts?.map((post) => {
            if (post.id == updatedPost.id) {
                return updatedPost;
            }
            return post;
        });
        setPosts(updatedPosts);
        // update the post in the database
        axios.put(`http://192.168.1.3:8080/upvotes/${updatedPost.id}`, {
            userId,
            operation,
        });
    };

    const removeSinglePost = async (updatedPost: Post, userId: string) => {
        const updatedPosts = posts?.filter((post) => post.id != updatedPost.id);
        setPosts(updatedPosts);
        
        if (updatedPost.imageName) {
            await axios.delete("/api/delete-image", {
                data: {
                    imageName: updatedPost.imageName,
                },
            });
        }

        // update the post in the database
        axios.put(`http://192.168.1.3:8080/posts/${updatedPost.id}`, {
            userId,
        });
    };

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://192.168.1.3:8080/posts`
                );
                setPosts(response.data);
            } catch (error: any) {
                setError(error.message);
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    return {
        posts,
        setPosts,
        updateSingleUpVote,
        removeSinglePost,
        error,
        loading,
    };
}
