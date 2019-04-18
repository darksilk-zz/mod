const { format } = require('timeago.js');
const ago = {};
const moment = require('moment');

ago.timeago = (timestamp) => {
    return format(timestamp);
};

ago.timeagoMoment = (timestamp) => {
    let time = moment(timestamp);
    moment.locale('es');
    return moment(timestamp).fromNow();
};

module.exports = ago;