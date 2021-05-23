DROP DATABASE IF EXISTS empTracker_DB;
CREATE DATABASE empTracker_DB;

USE empTracker_DB;



CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dept_name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  role_title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  dept_id INT,
  FOREIGN KEY (dept_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  manager_id INT,
  role_id INT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);


INSERT INTO department (dept_name)
VALUE ("Sales");
INSERT INTO department (dept_name)
VALUE ("Engineering");
INSERT INTO department (dept_name)
VALUE ("Finance");
INSERT INTO department (dept_name)
VALUE ("Legal");
INSERT INTO department (dept_name)
VALUE ("Communications");
INSERT INTO department (dept_name)
VALUE ("Administration");


INSERT INTO role (role_title, salary, dept_id)
VALUE ("Lead Engineer", 150000, 2);
INSERT INTO role (role_title, salary, dept_id)
VALUE ("Legal Team Lead", 130000, 4);
INSERT INTO role (role_title, salary, dept_id)
VALUE ("Accountant", 100000, 3);
INSERT INTO role (role_title, salary, dept_id)
VALUE ("Admin Coordinator", 80000, 6);
INSERT INTO role (role_title, salary, dept_id)
VALUE ("Sales Lead", 110000, 1);
INSERT INTO role (role_title, salary, dept_id)
VALUE ("Software Engineer", 120000, 2);
INSERT INTO role (role_title, salary, dept_id)
VALUE ("Junior Engineer", 700000, 2);
INSERT INTO role (role_title, salary, dept_id)
VALUE ("Communications Director", 110000, 5);
INSERT INTO role (role_title, salary, dept_id)
VALUE ("Sales Assistant", 60000, 1);


INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Susan", "Cain", null, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Brene", "Toll", null, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Chops","McGoven",null,8);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Beth", "Tranh", null, 5);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("George", "Tolkin", null, 3);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Travis", "McKracken", null, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Cheryl", "Ng", 4, 9);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Brian", "Grant", 1, 7);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Connie", "Star", 2, 6);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Brett", "Rover", 3, 6);

SELECT * FROM department;

SELECT * FROM role;

SELECT * FROM employee;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new password';

flush privileges;

SELECT CONCAT( e2.first_name, " ", e2.last_name ) AS Manager, e1.manager_id
FROM employee e1
INNER JOIN role ON role.id = e1.role_id 
INNER JOIN department ON department.id = role.dept_id 
LEFT JOIN employee e2 ON e2.id = e1.manager_id;
    
SELECT first_name, last_name, role_id, dept_name FROM employee INNER JOIN department ON department.id = role.dept_id WHERE dept_name = 'Sales';


SELECT CONCAT( e1.first_name, " ", e1.last_name ) AS "Employee Name", role_title AS Role, dept_name AS Department, salary AS Salary, CONCAT( e2.first_name, " ", e2.last_name ) AS Manager, dept_id FROM employee e1 INNER JOIN role ON role.id = e1.role_id WHERE dept_name = 'Sales';

SELECT CONCAT( e1.first_name, " ", e1.last_name ) AS "Employee Name", role_title AS Role, dept_name AS Department, salary AS Salary, CONCAT( e2.first_name, " ", e2.last_name ) AS Manager, dept_id FROM employee e1 INNER JOIN role ON role.id = e1.role_id INNER JOIN department ON department.id = role.dept_id LEFT JOIN employee e2 ON e2.id = e1.manager_id;

SELECT CONCAT( e1.first_name, " ", e1.last_name ) AS "Employee Name", role_title AS Role, dept_name AS Department, salary AS Salary, CONCAT( e2.first_name, " ", e2.last_name ) AS Manager FROM employee e1 INNER JOIN role ON role.id = e1.role_id INNER JOIN department ON department.id = role.dept_id LEFT JOIN employee e2 ON e2.id = e1.manager_id WHERE dept_name = 'Sales';


SELECT CONCAT( e1.first_name, " ", e1.last_name ) AS "Employee Name", role_title AS Role, dept_name AS Department, salary AS Salary, CONCAT( e2.first_name, " ", e2.last_name ) AS Manager FROM employee e1 INNER JOIN role ON role.id = e1.role_id INNER JOIN department ON department.id = role.dept_id LEFT JOIN employee e2 ON e2.id = e1.manager_id;
