var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if(err) return console.log(err.message);
    
    
})

sectionSelect();



    



function sectionSelect(){
    inquirer.prompt([
        {
            name: "sectionSelect",
            type: "list",
            choices: ["Customer", "Manager"],
            message: "What section do you want to access?"
        }
    ]).then(function(answer){
        switch(answer.sectionSelect){

            case "Customer":
                displayProducts();
                break;

            case "Manager":
                manageProduct();
                break;
        }
    })
}    


function displayProducts(){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) return console.log(err.message);

        console.table(res);
       
        inquirer.prompt([
            {
                name: "itemId",
                input: "text",
                message: "Select the ID you want to order"
            },
            {
                name: "itemQuantity",
                input: "text",
                message: "How many would you like?"
            }
        ]).then(function(answer){
            
            var chosenItem;
            for (var i = 0; i < res.length; i++){
                if(res[i].id == answer.itemId){
                  chosenItem = res[i];
                }
            }
            
            

            var updateStock = chosenItem.stock -= answer.itemQuantity;
            var costOfPurchase = chosenItem.price * answer.itemQuantity;
            
            if(updateStock < 0){

                console.log("Sorry we are out of stock")

                inquirer.prompt([
                    {
                        name: "promptContinue",
                        type: "confirm",
                        message: "Do you wish to try again?"
                    }
                ]).then(function(answer){
                    if(answer.promptContinue === true){
                        sectionSelect();
                    }
                    else{
                        console.log("Cya");
                        connection.end();
                    }
                })
            }

            else{
            console.log("You have bought " + answer.itemQuantity + " " + chosenItem.name);
            console.log("Your total is: $" + costOfPurchase);

            var query = connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock: updateStock
                    },
                    {
                        id: answer.itemId
                    }
                ]
            )

            inquirer.prompt([
                {
                    name: "promptContinue",
                    type: "confirm",
                    message: "Would you like to do anything else?"
                }
            ]).then(function(answer){
                if(answer.promptContinue === true){
                    sectionSelect();
                }
                else{
                    console.log("Thanks for using Bamazon and have a great day!")
                    connection.end();
                }
            });
        }
        });
        
    });
}

function manageProduct(){

    
    inquirer.prompt([
        {
            name: "managerOptions",
            type: "list",
            choices: ["View Products", "Add Stock", "Low Inventory", "Add New Product"],
            message: "What do you want to do?"
        }
    ]).then(function(answer){
        switch(answer.managerOptions){

            case "View Products":
            viewStock();
            break;

            case "Add Stock":
            addStock();
            break;

            case "Low Inventory":
            lowInventory();
            break;

            case "Add New Product":
            addNewProduct();
            break;
        }
    })
}


function viewStock(){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) return console.log(err.message);

        console.table(res);
        managerContinuePrompt();
        
    });

    
}


function addStock(){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) return console.log(err.message);

        console.table(res);

        inquirer.prompt([
            {
                name: "itemId",
                input: "text",
                message: "Please select an item ID for restocking."
            },
            {
                name: "itemQuantity",
                input: "text",
                message: "How many should we restock of this item?"
            }
        ]).then(function(answer){

            var chosenItem;
            for(var i = 0; i < res.length; i++){
                if(res[i].id == answer.itemId){
                    chosenItem = res[i];
                }
            }

            
            var parsed = parseInt(answer.itemQuantity);

            var restockedQuantity = chosenItem.stock += parsed;

            

            console.log("You have restocked " + chosenItem.name + " the warehouse now has: " + chosenItem.stock + " in stock.");

            var query = connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock: restockedQuantity
                    },
                    {
                        id: answer.itemId
                    }
                ]
            )

            managerContinuePrompt();
        });
    });
}


function lowInventory(){
    connection.query("SELECT * FROM products WHERE stock < 20", function(err, res){
        if(err) return console.log(err.message);

        console.table(res);
        managerContinuePrompt();
        
    });

    
}


function addNewProduct(){
    connection.query("SELECT * FROM products WHERE stock < 20", function(err, res){
        if(err) return console.log(err.message);


        inquirer.prompt([
            {
                name: "newProductName",
                input: "text",
                message: "What is the new products name?"
            },
            {
                name: "department",
                input: "text",
                message: "What department should it be house under?"
            },
            {
                name: "price",
                input: "text",
                message: "What is the sale's price for this item?"
            },
            {
                name: "stock",
                input: "text",
                message: "What is the current stock for this new item?"
            }
        ]).then(function(answers){

            var query = connection.query(
                "INSERT INTO products SET ?",
                {
                    name: answers.newProductName,
                    department_name: answers.department,
                    price: answers.price,
                    stock: answers.stock
                },
                function(err, res){
                    console.log("You have added " + answers.newProductName + " into the " + answers.department + " department, with the price of $" + answers.price + " and with the currenct stock of " + answers.stock);
                    managerContinuePrompt();

                }
            )

            
        });

        
       
        
    });
}



function managerContinuePrompt(){
    inquirer.prompt([
        {
            name: "promptContinue",
            type: "confirm",
            message: "Would you like to order anything else?" 
        }
    ]).then(function(answer){
        if(answer.promptContinue === true){
            sectionSelect();
        }
        else{
            console.log("Closing out Manager section.")
            connection.end();
        }
    });
}


    
