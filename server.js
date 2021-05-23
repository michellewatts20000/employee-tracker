const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const CFonts = require('cfonts');
// const viewEmployees = require('./functions/viewEmployees.js');
// var db = require('./db');


require('dotenv').config()
// MYSQL DB connection information
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


// prompts inquirer to ask user what they want to do
const welcome = () => {
  CFonts.say('Employee|Tracker', {
    font: 'simple',
    align: 'left',
    colors: ['yellow'],
    env: 'node'

  });
  start()
}


const start = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all employees',
        'View employees by department',
        'View employees by role',
        'View employees by manager',
        'Add employee',
        'Add department',
        'Add role',
        'Update employee role',
        'Delete employee',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all employees':
          viewEmployees();
          break;

        case 'View employees by department':
          viewDepartment();
          break;

          case 'View employees by role':
          viewRoles();
          break;

        case 'View employees by manager':
          viewEmployeesManager();
          break;

        case 'Add employee':
          addEmployees();
          break;

        case 'Add department':
          addDepartment();
          break;

        case 'Add role':
          addRole();
          break;

        case 'Update employee role':
          updateEmployeeRole();
          break;

        case 'Delete employee':
          deleteEmployee();
          break;

        case 'Exit':
          connection.end();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};


const viewEmployees = () => {
  // query the database for all employees
  connection.query('SELECT CONCAT( e1.first_name, " ", e1.last_name ) AS "Employee Name", role_title AS Role, dept_name AS Department, salary AS Salary, CONCAT( e2.first_name, " ", e2.last_name ) AS Manager FROM employee e1 INNER JOIN role ON role.id = e1.role_id INNER JOIN department ON department.id = role.dept_id LEFT JOIN employee e2 ON e2.id = e1.manager_id;', (err, results) => {

    console.table(results);
    if (err) throw err;
    start();
  })
}



const addEmployees = () => {
  // inquirer prompt to ask for new employee details
  inquirer
    .prompt([{
        name: 'f_name',
        type: 'input',
        message: 'What is the first name of your new employee?',
      },
      {
        name: 'l_name',
        type: 'input',
        message: 'What is their surname?',
      },
      {
        name: 'role',
        type: 'list',
        message: 'What is their role?',
        choices: selectRole()
      },
      {
        name: 'manager',
        type: 'list',
        message: 'Who is their manager?',
        choices: selectManager()
      }
    ])
    .then((answer) => {
      if (answer.manager === "No Manager") {

        let roleId = allRoles.indexOf(answer.role) + 1;

        connection.query(
          'INSERT INTO employee SET ?', {
            first_name: answer.f_name,
            last_name: answer.l_name,
            role_id: roleId,

          },
          (err) => {
            if (err) throw err;
            console.log('Your employee was created successfully!');
            start();
          }
        );
      } else {

        let roleId = allRoles.indexOf(answer.role) + 1;
        let managerId = allManagers.indexOf(answer.manager) + 1;

        connection.query(
          'INSERT INTO employee SET ?', {
            first_name: answer.f_name,
            last_name: answer.l_name,
            role_id: roleId,
            manager_id: managerId,
          },
          (err) => {
            if (err) throw err;
            console.log('Your employee was created successfully!');
            start();
          }
        );
      }
    });
};


const updateEmployeeRole = () => {
  // query the database for all employees
  connection.query("SELECT id, role_id, first_name, last_name, CONCAT( first_name, ' ', last_name ) AS full_name FROM employee", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([{
          name: 'choice',
          type: 'rawlist',
          choices() {
            const choiceArray = [];
            results.forEach(({
              full_name
            }) => {
              choiceArray.push(full_name);
            });
            return choiceArray;
          },
          message: 'Which employee`s role would you like to update?',
        },
        {
          name: 'role',
          type: 'list',
          message: 'What is their new role?',
          choices: selectRole()
        }
      ])
      .then((answer) => {
        // get the information of the chosen item
        let chosenEmployee;
        let roleId = allRoles.indexOf(answer.role) + 1;
        results.forEach((employee) => {
          if (employee.full_name === answer.choice) {
            chosenEmployee = employee;
            
          }

        });
       

        connection.query(
          "UPDATE employee SET role_id = ? WHERE id = ?",
          [roleId, chosenEmployee.id],
          (err) => {
            if (err) throw err;
            console.log('Your employee was successsfully updated!');
            start();
          }
        );

      });
  })
};




// connect to the mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  welcome();
});


var allRoles = [];

function selectRole() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      allRoles.push(res[i].role_title);
    }

  })

  return allRoles;
}

var allDepartments = [];

function selectDepartment() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      allDepartments.push(res[i].dept_name);
    }

  })

  return allDepartments;
}



var allManagers = [];

function selectManager() {
  connection.query("SELECT DISTINCT CONCAT( e2.first_name, ' ', e2.last_name ) AS Manager, e1.manager_id FROM employee e1 INNER JOIN employee e2 ON e2.id = e1.manager_id WHERE e1.manager_id IS NOT NULL;",
    function (err, res) {

      if (err) throw err
      for (var i = 0; i < res.length; i++) {
        allManagers.push(res[i].Manager);
      }
      allManagers.push("No Manager");
    })
  return allManagers;
}



const deleteEmployee = () => {
  // query the database for all employees
  connection.query("SELECT id, role_id, first_name, last_name, CONCAT( first_name, ' ', last_name ) AS full_name FROM employee", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([{
        name: 'choice',
        type: 'rawlist',
        choices() {
          const choiceArray = [];
          results.forEach(({
            full_name
          }) => {
            choiceArray.push(full_name);
          });
          return choiceArray;
        },
        message: 'Which employee would you like to delete?',
      }])
      .then((answer) => {
        // get the information of the chosen item
        let chosenEmployee;
        results.forEach((employee) => {
          if (employee.full_name === answer.choice) {
            chosenEmployee = employee;
          }
        });
        connection.query(
          "DELETE FROM employee WHERE id = ?",
          [chosenEmployee.id],
          (err) => {
            if (err) throw err;
            console.log('Your employee was successsfully deleted!');
            start();
          }
        );

      });
  })
};





const viewDepartment = () => {
  // query the database for all employees
  connection.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;

    inquirer
      .prompt([{
          name: 'choice',
          type: 'rawlist',
          choices() {
            const choiceArray = [];
            results.forEach(({
              dept_name
            }) => {
              choiceArray.push(dept_name);
            });
            
            return choiceArray;
          },
          message: 'Which department would you like to see?',
        }

      ])


      .then((answer) => {

        connection.query('SELECT CONCAT( e1.first_name, " ", e1.last_name ) AS "Employee Name", role_title AS Role, dept_name AS Department, salary AS Salary, CONCAT( e2.first_name, " ", e2.last_name ) AS Manager FROM employee e1 INNER JOIN role ON role.id = e1.role_id INNER JOIN department ON department.id = role.dept_id LEFT JOIN employee e2 ON e2.id = e1.manager_id WHERE dept_name = ?', [answer.choice], (err, results) => {

          console.table(results)
          start();
        })

      })


  });

}






const viewEmployeesManager = () => {
  connection.query('SELECT DISTINCT CONCAT( e1.first_name, " ", e1.last_name ) AS "Employee Name", e1.manager_id, role_title AS Role, dept_name AS Department, salary AS Salary, CONCAT( e2.first_name, " ", e2.last_name ) AS Manager FROM employee e1 INNER JOIN role ON role.id = e1.role_id INNER JOIN department ON department.id = role.dept_id LEFT JOIN employee e2 ON e2.id = e1.manager_id WHERE e1.manager_id IS NOT NULL', (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([{
          name: 'choice',
          type: 'rawlist',
          choices() {
            const choiceArray = [];
            results.forEach(({
              Manager
            }) => {
              choiceArray.push(Manager);
            });
            return choiceArray;
          },
          message: 'Which manager`s team would you like to see?',
        }

      ])

      .then((answer) => {

        let chosenEmployee;
        results.forEach((employee) => {
          if (employee.Manager === answer.choice) {
            chosenEmployee = employee;
          }
        });

        connection.query('SELECT CONCAT( e1.first_name, " ", e1.last_name ) AS "Employee Name", role_title AS Role, dept_name AS Department, salary AS Salary, CONCAT( e2.first_name, " ", e2.last_name ) AS Manager FROM employee e1 INNER JOIN role ON role.id = e1.role_id INNER JOIN department ON department.id = role.dept_id LEFT JOIN employee e2 ON e2.id = e1.manager_id WHERE e1.manager_id = ?', [chosenEmployee.manager_id], (err, results) => {
          console.table(results)


          start();
        })
      })
  })
};



const addDepartment = () => {
  // inquirer prompt to ask for new employee details
  inquirer
    .prompt([{
      name: 'dept_name',
      type: 'input',
      message: 'What is the name of your new department?',
    }, ])
    .then((answer) => {
      connection.query(
        'INSERT INTO department SET ?', {
          dept_name: answer.dept_name,
        },
        (err) => {
          if (err) throw err;
          console.log('Your department was created successfully!');
          start();
        }
      );


    });
};


const addRole = () => {
  connection.query('SELECT CONCAT( e1.first_name, " ", e1.last_name ) AS "Employee Name", role_title AS Role, dept_id, dept_name AS Department, salary AS Salary, CONCAT( e2.first_name, " ", e2.last_name ) AS Manager FROM employee e1 INNER JOIN role ON role.id = e1.role_id INNER JOIN department ON department.id = role.dept_id LEFT JOIN employee e2 ON e2.id = e1.manager_id', (err, results) => {
    if (err) throw err;
    // inquirer prompt to ask for new employee details
    inquirer
      .prompt([{
          name: 'role_name',
          type: 'input',
          message: 'What is the name of your new role?',
        },
        {
          name: 'salary',
          type: 'input',
          message: 'What is the salary of your new role?',
        },
        {
          name: 'department',
          type: 'list',
          message: 'What department is it in?',
          choices: selectDepartment(),
        },

      ])
      .then((answer) => {
        let chosenEmployee;
        results.forEach((employee) => {
          if (employee.Department === answer.department) {
            chosenEmployee = employee;

          }
        });
       
        connection.query(
          'INSERT INTO role SET ?', {
            role_title: answer.role_name,
            salary: answer.salary,
            dept_id: chosenEmployee.dept_id,
          },
          (err) => {
            if (err) throw err;
            console.log('Your role was created successfully!');
            start();
          }
        );


      });
  })
};


const viewRoles = () => {
  // query the database for all employees
  connection.query('SELECT * FROM role', (err, results) => {
    if (err) throw err;

    inquirer
      .prompt([{
          name: 'choice',
          type: 'rawlist',
          choices() {
            const choiceArray = [];
            results.forEach(({
              role_title
            }) => {
              choiceArray.push(role_title);
            });
           
            return choiceArray;
          },
          message: 'Which role would you like to see?',
        }

      ])


      .then((answer) => {

        connection.query('SELECT CONCAT( e1.first_name, " ", e1.last_name ) AS "Employee Name", role_title AS Role, dept_name AS Department, salary AS Salary, CONCAT( e2.first_name, " ", e2.last_name ) AS Manager FROM employee e1 INNER JOIN role ON role.id = e1.role_id INNER JOIN department ON department.id = role.dept_id LEFT JOIN employee e2 ON e2.id = e1.manager_id WHERE role_title = ?', [answer.choice], (err, results) => {

          console.table(results)
          start();
        })

      })


  });

}