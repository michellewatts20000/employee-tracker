const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

const viewEmployees = () => {
    // query the database for all employees
    connection.query('SELECT CONCAT( e1.first_name, " ", e1.last_name ) AS "Employee Name", role_title AS Role, dept_name AS Department, salary AS Salary, CONCAT( e2.first_name, " ", e2.last_name ) AS Manager FROM employee e1 INNER JOIN role ON role.id = e1.role_id INNER JOIN department ON department.id = role.dept_id LEFT JOIN employee e2 ON e2.id = e1.manager_id;', (err, results) => {
  
      console.table(results);
      if (err) throw err;
      start();
    })
  }


//   module.exports =  viewEmployees;