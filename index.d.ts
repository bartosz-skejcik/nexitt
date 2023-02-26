interface User {
    id: number;
    full_name: string;
    username: string;
    password: string;
    email: string;
    avatar: string;
    created_at: Date;
}

interface Post {
    id: number;
    title: string;
    body?: string;
    link?: string;
    imageName?: string;
    created_at: Date;
    authorId: number;
    upvotes: Array<number>;
    comments: Array<Comment>;
}

interface Comment {
    id: number;
    body: string;
    created_at: Date;
    post_id: number;
    user: { id: number; username: string; full_name: string; avatar: string };
}
