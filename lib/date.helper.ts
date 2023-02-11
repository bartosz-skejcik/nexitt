import moment from "moment";

const getTimeFromDate = (date: Date) => {
    var dateFormater = moment(date).locale("pl");
    return dateFormater.fromNow();
};

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

export { getTimeFromDate, sortPostsByDate, sortPostsByUpVotes };
