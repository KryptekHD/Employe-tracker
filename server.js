const inquire = require('inquirer');
const mysql = require('mysql2');
const validate =require('./javascript/validate');
const { default: inquirer } = require('inquirer');



const db =mysql.createConnection({
    host:'localhost',
    port: 3306,
    user:'root',
    pasword:'pasword123',
    database:'employee_db'
},
console.log(`Connected to Employee_db`)
);

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
        db.end();
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

const updateEmployeeManager = () => {
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
                    message:'which employee has a new manager',
                    choices: employeeNamesArray
                 },
                 {
                    name:'chosenRole',
                    type:'list',
                    message:'who is ther manager?',
                    choices: employeeNamesArray,
                 }
            ])

            .then((answer) => {
                let newId, managerId;
                response.forEach((employee) =>{
                    if(answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`){
                        employeeId = employee.id;
                    }
                    if(answer.newManager === `${employee.first_name} ${employee.last_name}`){
                        managerId = employee.id;

                    }
                });

                if(validate.isSame(answer.chosenEmployee, answer.newManager)){
                    console.log('invalid manager')
                }
                else{
                    let sql = `UPDATE employee SET employee.manager_id =? WHERE employee.id =?`

                    db.query(sql,[managerId,employeeId],(err) => {
                        if(err) throw err;
                        console.log('the employees manager has been updated')
                    })
                }
            });
        });
    });

}

const addEmployee = ()=>{
    inquire .prompt([
        {
            type: 'input',
            name: 'fistName',
            message: "What is the employee's first name?",
            validate: addFirstName => {
              if (addFirstName) {
                  return true;
              } else {
                  console.log('Please enter a first name');
                  return false;
              }
            }
          },
          {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
            validate: addLastName => {
              if (addLastName) {
                  return true;
              } else {
                  console.log('Please enter a last name');
                  return false;
              }
            }
          }
    ])
    .then(answer => {
        const crit = [answer.fistName, answer.lastName]
        const roleSql = `SELECT roles.id, roles.role_title FROM roles`;
        db.promise().query(roleSql, (error, data) => {
          if (error) throw error; 
          const roles = data.map(({ id, title }) => ({ name: title, value: id }));
          inquire.prompt([
                {
                  type: 'list',
                  name: 'role',
                  message: "What is the employee's role?",
                  choices: roles
                }
              ])
                .then(roleChoice => {
                  const role = roleChoice.role;
                  crit.push(role);
                  const managerSql =  `SELECT * FROM employee`;
                  connection.promise().query(managerSql, (error, data) => {
                    if (error) throw error;
                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                    inquire.prompt([
                      {
                        type: 'list',
                        name: 'manager',
                        message: "Who is the employee's manager?",
                        choices: managers
                      }
                    ])
                      .then(managerChoice => {
                        const manager = managerChoice.manager;
                        crit.push(manager);
                        const sql =   `INSERT INTO employee (first_name, last_name, roles_id, manager_id)
                                      VALUES (?, ?, ?, ?)`;
                        connection.query(sql, crit, (error) => {
                        if (error) throw error;
                        console.log("Employee has been added!")
                        viewAllEmployees();
                  });
                });
              });
            });
         });
       
    })
}

const addDepartment = () =>{
    inquire.promnt([
        {
            name: 'newDepartment',
            type:'input',
            message:'what new department would you like to add?',
            validate:validate.validateString
        }
    ])
    .then((answer) =>{
        let sql =`INSERT INTO department (department_name) VALUES (?)`;

        connection.query(sql, answer.newDepartment, (error, response) => {
          if (error) throw error;
          console.log(answer.newDepartment + ` Department successfully created!`);
        
       })
    })
}

const removeEmployee = () => {
    let sql =     `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;

    connection.promise().query(sql, (error, response) => {
      if (error) throw error;
      let employeeNamesArray = [];
      response.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

      inquire.prompt([
          {
            name: 'chosenEmployee',
            type: 'list',
            message: 'Which employee would you like to remove?',
            choices: employeeNamesArray
          }
        ])
        .then((answer) => {
          let employeeId;

          response.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });

          let sql = `DELETE FROM employee WHERE employee.id = ?`;
          db.query(sql, [employeeId], (error) => {
            if (error) throw error;
            console.log(chalk.redBright(`Employee Successfully Removed`));
            viewAllEmployees();
          });
        });
    });
}

const removeRole = () => {
    let sql = `SELECT roles.id, roles.role_title FROM roles`;

    db.promise().query(sql, (error, response) => {
      if (error) throw error;
      let roleNamesArray = [];
      response.forEach((roles) => {roleNamesArray.push(roles.role_title);});

      inquire.prompt([
          {
            name: 'removingRole',
            type: 'list',
            message: 'What role would you like to remove?',
            choices: roleNamesArray
          }
        ])
        .then((answer) => {
          let roleId;

          response.forEach((role) => {
            if (answer.chosenRole === roles.role_title) {
              roleId = roles.id;
            }
          });

          let sql =   `DELETE FROM roles WHERE roles.id = ?`;
          db.promise().query(sql, [roleId], (error) => {
            if (error) throw error;
           
            console.log(`the role has been removed from the data base!`);
            viewAllRoles();
          });
        });
    });

}

const removeDepartment = () => {
    let sql =   `SELECT department.id, department.department_name FROM department`;
    connection.promise().query(sql, (error, response) => {
      if (error) throw error;
      let departmentNamesArray = [];
      response.forEach((department) => {departmentNamesArray.push(department.department_name);});

      inquire.prompt([
          {
            name: 'chosenDept',
            type: 'list',
            message: 'Which department would you like to remove?',
            choices: departmentNamesArray
          }
        ])
        .then((answer) => {
          let departmentId;

          response.forEach((department) => {
            if (answer.chosenDept === department.department_name) {
              departmentId = department.id;
            }
          });

          let sql = `DELETE FROM department WHERE department.id = ?`;
          db.promise().query(sql,[departmentId], (error) => {
            if (error) throw error;
            
            console.log(`Department has been removed`);
            
            viewAllDepartments();
          });
        });
    });

}

const  quit = () => {

}