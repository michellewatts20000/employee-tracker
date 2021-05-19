DROP DATABASE IF EXISTS empTracker_DB;
CREATE DATABASE empTracker_DB;

USE empTracker_DB;

CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INT NOT NULL AUTO_INCREMENT,
  role_title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,4) NULL,
  dept_id INT default 0,
  PRIMARY KEY (id)
);

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT default 0,
  manager_id INT default 0,
  PRIMARY KEY (id)
);

SELECT * FROM department;
select * from role;
select * from employee;


INSERT INTO department (dept_name)
VALUES ("Administration");

INSERT INTO department (dept_name)
VALUES ("Engineering");

INSERT INTO department (dept_name)
VALUES ("Legal");

INSERT INTO department (dept_name)
VALUES ("Finance");

INSERT INTO department (dept_name)
VALUES ("Communications");


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Susan", "Smith", 1, 2 );

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Brian", "Travis", 2, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Chops", "McGoven", 3, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Beth", "Tranh", 2, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Cheryl", "Ng", 5, null);

INSERT INTO role (role_title, salary, dept_id)
VALUES ("Senior Engineer", "90000", 5);

INSERT INTO role (role_title, salary, dept_id)
VALUES ("Junior Engineer", "60000", 4);

INSERT INTO role (role_title, salary, dept_id)
VALUES ("CFO", "100000", 30);

INSERT INTO role (role_title, salary, dept_id)
VALUES ("Communications Manager", "50000", 2);

INSERT INTO role (role_title, salary, dept_id)
VALUES ("Administration", "50000", 1);





