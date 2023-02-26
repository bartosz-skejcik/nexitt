const sortPostsByDate = (posts: any) => {
    return posts.sort((a: any, b: any) => {
        return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    });
};

const sortPostsByUpVotes = (posts: any) => {
    return posts.sort((a: any, b: any) => {
        return b.upvotes.length - a.upvotes.length;
    });
};

const sortPostsByComments = (posts: any) => {
    return posts.sort((a: any, b: any) => {
        return (
            b.comments.length - a.comments.length ||
            b.upvotes.length - a.upvotes.length
        );
    });
};

export { sortPostsByDate, sortPostsByUpVotes, sortPostsByComments };
