const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config()
// create the connection information for the sql database
const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: process.env.DB_USER,

    // Your passwords
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// function which prompts the user for what action they should take
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
    
    // query the database for all items being auctioned
    connection.query('SELECT * FROM employee', (err, results) => {
        
        console.table(results);
        if (err) throw err;
        start();
    })
    
   

}





// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});