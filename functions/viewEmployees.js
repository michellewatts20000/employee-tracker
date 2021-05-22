var db = require('../db');
var connection = require('connection');

const viewEmployees = () => {
    // query the database for all employees
    connection.query('SELECT CONCAT( e1.first_name, " ", e1.last_name ) AS "Employee Name", role_title AS Role, dept_name AS Department, salary AS Salary, CONCAT( e2.first_name, " ", e2.last_name ) AS Manager FROM employee e1 INNER JOIN role ON role.id = e1.role_id INNER JOIN department ON department.id = role.dept_id LEFT JOIN employee e2 ON e2.id = e1.manager_id;', (err, results) => {
  
      console.table(results);
      if (err) throw err;
      start();
    })
  }


  module.exports =  viewEmployees;

  // connection.connect((err) => {
  //   if (err) throw err;
  //   // run the start function after the connection is made to prompt the user
   
  // });