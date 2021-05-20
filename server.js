const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
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
const start = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all employees',
        'Add Employee',
        'Update Employee',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all employees':
          viewEmployees();
          break;

        case 'Add Employee':
          addEmployees();
          break;

        case 'Update Employee':
          updateEmployee();
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
    .prompt({
      name: 'action',
      type: 'input',
      message: 'What is the first name of your new employee?',
    })
    .then((answer) => {
      connection.query("INSERT INTO employee SET ?")
      if (err) throw err;
    })

  start();

}




// connect to the mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});