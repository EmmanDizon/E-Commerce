const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const errorHandling = require("./middlewares/errors");
const products = require("./routes/product");
const users = require("./routes/auth");
const orders = require("./routes/order");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

app.use("/api/products", products);
app.use("/api/users", users);
app.use("/api/orders", orders);
app.use(errorHandling);

module.exports = app;
