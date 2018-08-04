DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(25) NOT NULL,
    department_name VARCHAR(25) NOT NULL,
    price DECIMAL(4,2),
    stock INT(10),
    PRIMARY KEY (id)
);

INSERT INTO products (name, department_name, price, stock)
VALUES ("Peanut Butter & Jelly", "Sandwich", 2.00, 100), ("Hot Dog", "Not Sandwich", 2.50, 75), ("Hot Pocket", "Not Sandwich", 3.50, 50), ("Taco", "Not Sandwich", 3.00, 150), ("Tuna Melt", "Not Sandwich", 5.00, 25), ("BLT", "Sandwich", 2.75, 125), ("Footlong Sub", "Sandwich", 4.50, 200), ("Double Down Chicken", "Sandwich", 5.50, 50);