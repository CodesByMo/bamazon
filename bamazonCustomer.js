// need inquirer
var inq = require("inquirer");
var mysql = require('mysql');
require("dotenv").config();
var connection = mysql.createConnection({
    host: process.env["host"],
    port: process.env["port"],
    user: process.env["user"],
    password: process.env["password"],
    database: process.env["database"]
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("\n");
    // console.log("connected as id " + connection.threadId);
    show_db();
});


// show all items in db
function show_db() {
    connection.query("select * from products", function (err, res) {
        console.table(res);
        // for (var i = 0; i < res.length; i++) {
        //     console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quanity);
        askCustomer()
    });
};

// inquirer prompts: ask what product they want to buy & how many they would like to purchase
function askCustomer() {
    inq.prompt([
        {
            name: "product",
            type: "input",
            message: "What product(by item_id) would you like to buy?"
        }, {
            name: "quantity",
            type: "input",
            message: "How many would you like to purchase?"
        }
    ]).then(function (res) {
        console.log(res.product, res.quantity);
        calculateDB(res.product, parseInt(res.quantity));
    });
};


// function to check quanity of selected item from inquirer prompt #1
// if not enough quanity log "Insufficient quanity!"
function check_db() {
    connection.query("select * from products", function (err, res) {
        console.table(res);
        // for (var i = 0; i < res.length; i++) {
        //     console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quanity);
        askCustomer()
    });
};
// if quanity is purchasable, update bamazon_db, decrement item quanity(s)
// show total price of order/purchase
function calculateDB(itemId, stock) {
    console.log("stock 1:  " + stock);
    connection.query("select * from products where item_id =" + itemId, function (err, res) {
        console.log("Stock 2: " + stock);
        var stock_quanity = res[0].stock_quanity;
        if (!(stock <= stock_quanity && stock > -1)) {
            console.log("Insufficient quanity!");
        } else {
            console.log("stock 3: " + stock);
            console.log(res[0].stock_quanity);
            var math = res[0].stock_quanity - stock;
            console.log(math);
            var total = stock * res[0].price;
            console.log("total " + total);
            console.log("stock " + stock);
            console.log("price " + res[0].price);
            connection.query("update products set stock_quanity =" + math + " where item_id =" + itemId, function (err, res) {
                // console.log(res);
                // console.log(err);
            });
        }
    });
}
