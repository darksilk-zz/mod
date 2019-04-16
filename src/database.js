const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./keys');

const db = mysql.createPool(database);

db.getConnection((err, conn) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.log("Database connection was closed");
        }
        else if(err.code === 'ER_CON_COUNT_ERROR'){
                console.log('Database has too many connections');
        }
        else if(err.code === 'ECONNREFUSED'){
            console.log("Database connection connection was refused");
        }
    }
    if(conn) conn.release();
    console.log('DB MySQL is connected');
    return;
});

//Promsify pool queries. Convertir en promesas lo que antes eran callbacks
db.query = promisify(db.query);

module.exports = db;
