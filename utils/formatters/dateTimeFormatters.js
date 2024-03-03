const moment = require("moment-timezone");

const getIndianDateTimeFromTimeStamp = (timestamp) => {
    const indianTime = moment(timestamp).tz("Asia/Kolkata");

    const date = indianTime.format("DD-MM-YYYY");
    const time = indianTime.format("HH:mm:ss");

    return {date, time};
}

const increaseYearBy5 = (date) => {
    const new_date = new Date(date);
    new_date.setFullYear(new_date.getFullYear()+5);
    return new_date;
}

module.exports={getIndianDateTimeFromTimeStamp, increaseYearBy5};