const { format } = require('timeago.js');
const helpers = {};
const moment = require('moment');

helpers.timeago = (timestamp) => {
    return format(timestamp);
};

helpers.ago = (timestamp) => {
    let time = moment(timestamp);
    moment.locale('es');
    return moment(timestamp).fromNow();
};

helpers.createdAt = (timestamp) => {
    let time = moment(timestamp);
    moment.locale('es');
    time.locale(false);
    return time.format('LLLL')
}

helpers.isActive = (active) => {
    if(active === 0){
        return "No";
    }else if(active === 1){
        return "Si";
    }
}

helpers.ifCond = function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
}

helpers.math = function (lvalue, operator, rvalue) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
};

module.exports = helpers;