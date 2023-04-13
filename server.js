const fs = require('fs');
const inquire = require('inquirer');
const mysql = require('mysql2');


const PORT = process.env.PORT || 3001;

const db =mysql.createConnection({
    host:'localhost',
    user:'root',
    pasword:'pasword123',
    database:'employee_db'
});

