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

