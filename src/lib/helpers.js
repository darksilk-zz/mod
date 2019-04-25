const bcrypt = require('bcryptjs');
const helpers = {};

helpers.encryptPassword = async (password) => {
    console.log("Encriptando password")
    const salt = await bcrypt.genSalt(10);
    const cryptedPass = await bcrypt.hash(password, salt);
    
    return cryptedPass;
};

helpers.decryptPassword = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch(e){
        console.log(e);
    }
};


module.exports = helpers;