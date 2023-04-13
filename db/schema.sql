DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL 
);

CREATE TABLE roles(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    role_title VARCHAR(100) NOT NULL,
    salery DECIMAL,
    departments_id INT,
    FOREIGN KEY(departments_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    firs_name TEXT,
    last_name TEXT,
    role_id INT,
    FOREIGN KEY(role_id)
    REFERENCES roles(id),
    manger_id INT,
    FOREIGN KEY (manger_id)
    REFERENCES employee(id)
    ON DELETE SET NULL
);
