import moment from "moment";

const getTimeFromDate = (date: Date) => {
    var dateFormater = moment(date).locale("pl");
    return dateFormater.fromNow();
};

export { getTimeFromDate };
