var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'fish',
    password: 'Q!2dltnals',
    database: 'fish_doc'
});
exports.conn = connection;
