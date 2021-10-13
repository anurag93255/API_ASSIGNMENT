const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'anurag',
    password: '1234SnnS',
    database: 'assignment'
});

connection.connect((err) => { 
    if(err) console.log('Connection failed \n Error: ' + JSON.stringify(err));
    else console.log('Mysql Connection succeded');
});

module.exports = {connection}