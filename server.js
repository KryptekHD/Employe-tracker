const inquire = require('inquirer');
const mysql = require('mysql2');
const validate =require('./javascript/validate');


const PORT = process.env.PORT || 3001;

const db =mysql.createConnection({
    host:'localhost',
    user:'root',
    pasword:'pasword123',
    database:'employee_db'
},
console.log(`Connected to Employee_db`)
);




