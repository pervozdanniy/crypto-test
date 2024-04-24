const moment = require("moment");
const {msg} = require("../util/msg");

const normalizePort = (val) => {
    let port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;

    return false;
};

const responseGenerator = (req, execStatus, httpStatus, msg, data) => {
    return {execStatus, httpStatus, msg, data};
};

const getIpAddressFromHttpRequest = (req) => {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
}

const methodNotAllowed = (req, res, next) => {
    res.status(405).send(responseGenerator(req, false, 405, msg.method_not_allowed));
}

const isObjectEmpty = (obj) => {
    return Object.keys(obj).length === 0;
}

const addMilliSeconds = (millis) => {
    let newDate = moment().add(millis, 'ms');
    return newDate;
}

const addMinutes = (minutes) => {
    let newDate = moment().add(minutes, 'minutes');
    return newDate;
}

const addDays = (days) => {
    return moment().add(days, 'days');
}

const currentDate = () => {
    return moment();
}

const formatDate = (date, formatString) => {
    return date.format(formatString);
}

const isEnumKeyValid = (enumObject, target) => {
    return enumObject.hasOwnProperty(target);
}

const getCurrentMillis = () => {
    let millis = moment().valueOf();
    return millis;
}

const cloneObject = (obj) => {
    if (null == obj || "object" != typeof obj) return obj;
    return Object.assign({}, obj);
}

const isEmptyString = (value) => {
    return /^\s*$/.test(value.trim());
};

const convertTimeStringToMillis = (timeString) => {
    const time = parseInt(timeString);
    const unit = timeString.replace(time, '');
    switch (unit) {
        case 'm':
            return time * 60 * 1000;
        case 's':
            return time * 1000;
        case 'd':
            return time * 24 * 60 * 60 * 1000;
        default:
            throw new Error('Invalid time unit');
    }
}

const getExtension = (filename) => {
    let index = filename.lastIndexOf('.');
    return index < 0 ? '' : filename.substr(index + 1);
}

module.exports = {
    currentDate,
    addDays,
    addMinutes,
    normalizePort,
    responseGenerator,
    getIpAddressFromHttpRequest,
    methodNotAllowed,
    isObjectEmpty,
    isEnumKeyValid,
    getCurrentMillis,
    cloneObject,
    isEmptyString,
    convertTimeStringToMillis,
    getExtension,
    addMilliSeconds,
    formatDate
}