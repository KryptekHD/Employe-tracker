const inquire = require('inquirer');
const mysql = require('mysql2');
const validate =require('./javascript/validate');
const { default: inquirer } = require('inquirer');



const db =mysql.createConnection({
    host:'localhost',
    port: 3306,
    user:'root',
    password:'pasword123',
    database:'employee_db'
},
console.log(`Connected to Employee_db`),


);


const promptUser = () =>{inquire.prompt([
    {
    name:'choice',
    type:'list',
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
    if(choice === 'View All Departments'){
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
    if(choice === 'Add Role'){
        addRole();
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
}

// view all employees roles and departments
const viewAllEmployees = () => {
    db.query('SELECT * FROM employee',function (err,response){
        if (err) throw err;
        console.log(response);
        promptUser();
    })
    
};

const viewAllRoles = () =>{
    db.query('SELECT * FROM roles',function (err,response){
        if(err) throw err;
        console.log(response);
        promptUser();

    })
   
};
const viewAllDepartments = () =>{
    db.query('SELECT * FROM department',function (err,response){
        if(err) throw err

        console.log(response);
        promptUser();

    })
    
};

// viewing employees by departments 

const employeesByDepartment = () =>{
    db.query(`SELECT employee.first_name, 
    employee.last_name, 
    department.department_name AS department
    FROM employee 
    LEFT JOIN roles ON employee.role_id = roles.id 
    LEFT JOIN department ON roles.departments_id = department.id`,function (err,response){
        if(err)throw  err;
        console.log(response)
        promptUser();
    })
    
};

// updating employee roles and updating employee manager 

const updateEmployeeRole = ()=>{
            let sql =`SELECT employee.id, employee.first_name, employee.last_name, roles.id AS "role_id"
            FROM employee, roles, department WHERE department.id = roles.departments_id AND roles.id = employee.role_id`;
        db.query(sql, (err, response) => {
        if (err) throw err;
        let employeeNamesArray = [];
        response.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

        let sql =     `SELECT roles.id, roles.role_title FROM roles`;
        db.query(sql, (err, response) => {
        if (err) throw err;
        let rolesArray = [];
        response.forEach((role) => {rolesArray.push(role.role_title);});

        inquire.prompt([
        {
        name: 'chosenEmployee',
        type: 'list',
        message: 'Which employee has a new role?',
        choices: employeeNamesArray
        },
        {
        name: 'chosenRole',
        type: 'list',
        message: 'What is their new role?',
        choices: rolesArray
        }
        ])
        .then((answer) => {
        let newTitleId, employeeId;

        response.forEach((roles) => {
        if (answer.chosenRole === roles.role_title) {
        newTitleId = roles.id;
        }
        });

        response.forEach((employee) => {
        if (answer.chosenEmployee ===`${employee.first_name} ${employee.last_name}`) {
        employeeId = employee.id;
        }
        });

        let sqls = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
        db.query( sqls,[newTitleId, employeeId],(err) => {
        if (err) throw err;
        
        console.log(`Employee Role Updated`);
        
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
        if (err) throw err;
        let employeeNamesArray = [];
        response.forEach((employee )=>{employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`)});
        
        let sql = 'SELECT roles.id, roles.departments_id FROM roles';
        db.query(sql,(err,response) =>{
            if(err) throw err;
            let roleArray =[];
            response.forEach((roles) => {roleArray.push(roles.department_name)});

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
                let employeeId, managerId;
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
                promptUser();
            });
        });
    });

};

// adding employee and roles and departments

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
        db.query(roleSql, (error, data) => {
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
                  db.query(managerSql, (error, data) => {
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
                        const sql =   `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                      VALUES (?, ?, ?, ?)`;
                        db.query(sql, crit, (err) => {
                        if (err) throw err;
                        console.log("Employee has been added!")
                        viewAllEmployees();
                  });
                });
              });
            });
         });
       
    })
};
const addRole = () => {
    const sql = 'SELECT * FROM department'
    db.query(sql, (error, response) => {
        if (error) throw error;
        let deptNamesArray = [];
        response.forEach((department) => {deptNamesArray.push(department.department_name);});
        deptNamesArray.push('Create Department');
        inquire.prompt([
            {
              name: 'departmentName',
              type: 'list',
              message: 'Which department is this new role in?',
              choices: deptNamesArray
            }
          ])
          .then((answer) => {
            if (answer.departmentName === 'Create Department') {
              this.addDepartment();
            } else {
              addRoleResume(answer);
            }
          });
  
        const addRoleResume = (departmentData) => {
          inquire.prompt([
              {
                name: 'newRole',
                type: 'input',
                message: 'What is the name of your new role?',
                validate: validate.validateString
              },
              {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of this new role?',
                validate: validate.validateSalary
              }
            ])
            .then((answer) => {
              let createdRole = answer.newRole;
              let departmentId;
  
              response.forEach((department) => {
                if (departmentData.departmentName === department.department_name) {departmentId = department.id;}
              });
  
              let sql = `INSERT INTO roles (role_title, salery, departments_id) VALUES (?, ?, ?)`;
              let crit = [createdRole, answer.salary, departmentId];

              db.query(sql, crit, (err) => {
                if (err) throw err;
                
                console.log(`Role successfully created!`);
                
                viewAllRoles();
              });
            });
        };
      });
    };
  

const addDepartment = () =>{
    inquire.prompt([
        {
            name: 'newDepartment',
            type:'input',
            message:'what new department would you like to add?',
            validate:validate.validateString
        }
    ])
    .then((answer) =>{
        let sql =`INSERT INTO department (department_name) VALUES (?)`;

        db.query(sql, answer.newDepartment, (err, response) => {
          if (err) throw err;
          console.log(answer.newDepartment + ` Department successfully created!`);
          promptUser();
        
       })
    })
};

// removing employee roles and department 

const removeEmployee = () => {
    let sql =`SELECT employee.id, employee.first_name, employee.last_name FROM employee`;

    db.query(sql, (error, response) => {
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
          db.query(sql, [employeeId], (err) => {
            if (err) throw err;
            console.log(`Employee Successfully Removed`);
            viewAllEmployees();
          });
        });
    });
};

const removeRole = () => {
    let sql = `SELECT roles.id, roles.role_title FROM roles`;

    db.query(sql, (err, response) => {
      if (err) throw err;
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

          response.forEach((roles) => {
            if (answer.chosenRole === roles.role_title) {
              roleId = roles.id;
            }
          });

          let sql =   `DELETE FROM roles WHERE roles.id = ?`;
          db.query(sql, [roleId], (err) => {
            if (err) throw err;
           
            console.log(`the role has been removed from the data base!`);
            viewAllRoles();
          });
        });
    });

};

const removeDepartment = () => {
    let sql =   `SELECT department.id, department.department_name FROM department`;
    db.query(sql, (err, response) => {
      if (err) throw err;
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
          db.query(sql,[departmentId], (err) => {
            if (err) throw err;
            
            console.log(`Department has been removed`);
            
            viewAllDepartments();
          });
        });
    });

};

// starting up the function that will promplt the user questions that will decide what they will do 

promptUser()