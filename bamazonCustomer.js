var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'akalimain!',
    database: 'bamazon_db',
});

connection.connect();
console.log("");
console.log("*********************")
console.log("Welcome to Bamazon!")
console.log("*********************")
console.log("");

function checkIdExists(productsList, id) {
     for (var i = 0; i < productsList.length; i++) {
            if (productsList[i].id === parseInt(id)) {
                askHowMany(productsList[i]);
            } 
          
        }
}

function askHowMany(product) {
    inquirer.prompt([{
                type: "input",
                name: "quantity",
                message: "Set the amount you wish to purchase:"
            }]).then(function(data) {
                if (product.stock_quantity >= data.quantity) {
                    updateQuantity(data.quantity, product);
                }
                else {
                    console.log("Not enough, try again");
                    askHowMany(product);
                }
                
            })
}

function updateQuantity(quantity, product) {
    connection.query('UPDATE products SET stock_quantity=' + (product.stock_quantity - quantity) + ' WHERE id=' + product.id, function(error, results) {
        console.log(error);
        console.log(results);
    });
}

connection.query('SELECT id, product_name from products', function(error, results, fields) {

console.log(results);

    inquirer.prompt([{
        type: "input",
        name: "id",
        message: "Input the ID of the product you want to buy!"
    }]).then(function(data) {

        checkIdExists(results, data.id);
       

                    connection.end();
 
             });
        });