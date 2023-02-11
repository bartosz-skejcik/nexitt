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
    upvotes: Array<string>;
}
