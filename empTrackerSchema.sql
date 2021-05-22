DROP DATABASE IF EXISTS empTracker_DB;
CREATE DATABASE empTracker_DB;

USE empTracker_DB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dept_name VARCHAR(30)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  role_title VARCHAR(30),
  salary DECIMAL,
  dept_id INT,
  FOREIGN KEY (dept_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  manager_id INT,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
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
VALUE ("Tom", "Churchill", 1, 6);


SELECT * FROM department;

SELECT * FROM role;



SELECT CONCAT( e2.first_name, " ", e2.last_name ) AS Manager, e1.manager_id
FROM employee e1
INNER JOIN role ON role.id = e1.role_id 
INNER JOIN department ON department.id = role.dept_id 
LEFT JOIN employee e2 ON e2.id = e1.manager_id;
    



