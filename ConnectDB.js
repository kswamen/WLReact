var mysql = require('mysql');
var fs = require("fs");
var data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);

var db;

connectDatabase = () => {
    if (!db) {
        db = mysql.createConnection({
            host: conf.host,
            user: conf.user,
            password: conf.password,
            port: conf.port,
            database: conf.database
        });

        db.connect(function (err) {
            if (!err) {
                console.log('Database is connected!');
            } else {
                console.log('Error connecting database!');
            }
        });
    }
    return db;
}

module.exports = connectDatabase();