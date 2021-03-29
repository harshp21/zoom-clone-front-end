import dateformat from "dateformat";

class DateUtilService {

    parseDateInGivenFormat = (date, format) => {
        return dateformat(date, format);
    }
}

export default new DateUtilService();
