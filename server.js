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

inquire
inquire.prompt([
    {
    name:'choice',
    message: ' please choice an option',
    choices:[
        'View All Employees',
        'View All Roles',
        'View All Departments',
        'View All Employees By Department',
        'Update Employee Role',
        'Update Employee Manager',
        'Add Employee',
        'Add Role',
        'Add Department',
        'Remove Employee',
        'Remove Role',
        'Remove Department',
        'Quit'
        ]
    }
])
.then((answer)=>{
    const {choice} = answer;
    if(choice === 'View All Employees' ){
        viewAllEmployees();

    }
    if( choice === 'View All Roles' ){
        viewAllRoles();
    }
    if(choices === 'View All Departments'){
        viewAllDepartments();
    }
    if(choice === 'View All Employees By Department'){
        employeesByDepartment();
    }
    if(choice === 'Update Employee Role'){
        updateEmployeeRole();
    }
    if(choice === 'Update Employee Manager'){
        updateEmployeeManager();
    }
    if(choice === 'Add Employee' ){
        addEmployee();
    }
    if(choice === 'Add Department'){
        addDepartment();
    }
    if(choice === 'Remove Employee'){
        removeEmployee();
    }
    if(choice === 'Remove Role'){
        removeRole();
    }
    if( choice === 'Remove Department'){
        removeDepartment();
    }
    if(choice === 'Quit'){
        quit();
    }
})

const viewAllEmployees = () => {
    db.query('SELECT * FROM employee',function (err,response){
        console.log(response);
    })
    promptUser();
};

const viewAllRoles = () =>{
    db.query('SELECT * FROM roles',function (err,response){
        console.log(response);

    })
    promptUser();
};
const viewAllDepartments = () =>{
    db.query('SELECT * FROM department',function (err,response){
        if(err) throw err

        console.log(response);

    })
    promptUser();
};

const employeesByDepartment = () =>{
    db.query(`SELECT employee.first_name, 
    employee.last_name, 
    department.department_name AS department
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id`,function (err,respose){
        if(err)throw err;
        console.log(response)
    })
    promptUser();
};

const updateEmployeeRole = ()=>{
    let sql =`SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id
    FROM employee`;
    db.query(sql,(err,response) =>{
        letEmployeeNAmesArray = [];
        response.forEach((employee )=>{employee.namesArray.push(`${employee.first_name} ${employee.lastname}`)});
        
        let sql = 'SELECT role.id, role.department_name FROM role';
        db.query(sql,(err,response) =>{
            if(err) throw err;
            let roleArray =[];
            response.forEach((role) => {roleArray.push(role.department_name)});

            inquire.prompt([
                {
                    name:'chosenEmployee',
                    type:'list',
                    message:'which employee has a new role to play',
                    choices: employeeNamesArray
                 },
                 {
                    name:'chosenRole',
                    type:'list',
                    message:'what is there new role?',
                    choices: employeeNamesArray,
                 }
            ])

            .then((answer) => {
                let newId, employeeId;
                response.forEach((role) =>{
                    if(answer.chosenRole === role.department_name){
                        newId = role.id
                    }
                });
            
                response.forEach((employee) =>{
                    if( answer.chosenEmployee === `${employee.first_name} ${employee.last_name}}`){
                        employeeId = employee.id

                    }
                });

                let sql = `UPDATED employee SET employee.role_id = ? WHERE employee.id =?`

                db.query(sql,[newId,employeeId],(err) =>{
                    if(err) throw err;
                    console.log('employee updates made')
                    promptUser();
                });
            });
        });
    });
};
