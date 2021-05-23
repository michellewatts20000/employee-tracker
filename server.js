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
        'View all employees by department',
        'View all employees by manager',
        'Add employee',
        'Update employee role',
        'Update employee manager',
        'Delete employee',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all employees':
          viewEmployees();
          break;

        case 'View all employees by department':
          viewDepartment();
          break;

        case 'View all employees by manager':
          viewEmployees();
          break;

        case 'Add employee':
          addEmployees();
          break;

        case 'Update employee role':
          updateEmployeeRole();
          break;

        case 'Update employee manager':
          updateEmployee();
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
            console.log(chosenEmployee)
          }

        });
        // console.log("employee.first_name" , employee.first_name);
        console.log("chosenEmployee", chosenEmployee);


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


// const viewDepartment = () => {
//   // inquirer prompt to ask for new employee details
//   selectDepartment()

//   inquirer
//   .prompt([{
//     name: 'role',
//     type: 'list',
//     message: 'What department?',
//     choices: selectDepartment()
//    }])

//     .then((answer) => {
// connection.query('SELECT CONCAT( e1.first_name, " ", e1.last_name ) AS "Employee Name", role_title AS Role, dept_name AS Department, salary AS Salary, CONCAT( e2.first_name, " ", e2.last_name ) AS Manager FROM employee e1 INNER JOIN role ON role.id = e1.role_id INNER JOIN department ON department.id = role.dept_id LEFT JOIN employee e2 ON e2.id = e1.manager_id;', (err, results) => {

//         console.table(results);
//         if (err) throw err;
//         start();
//       })
//     })
// }


const viewDepartment = () => {
  // query the database for all employees
  connection.query('SELECT DISTINCT CONCAT( e1.first_name, " ", e1.last_name ) AS "Employee Name", role_id, role_title AS Role, dept_name AS Department, salary AS Salary, CONCAT( e2.first_name, " ", e2.last_name ) AS Manager FROM employee e1 INNER JOIN role ON role.id = e1.role_id INNER JOIN department ON department.id = role.dept_id LEFT JOIN employee e2 ON e2.id = e1.manager_id;', (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([{
          name: 'choice',
          type: 'rawlist',
          choices() {
            const choiceArray = [];
            results.forEach(({
              Department
            }) => {
              choiceArray.push(Department);
            });
            return choiceArray;
          },
          message: 'Which department would you like to see?',
        }

      ])
      .then((answer) => {
        // get the information of the chosen item

      });
    // console.log("employee.first_name" , employee.first_name);
    // console.log("chosenEmployee", chosenEmployee);

  });

}