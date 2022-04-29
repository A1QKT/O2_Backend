const express = require("express");
const bodyParser =require("body-parser");
require("./helpers/mongo")();

const app = express();

app.use(express.static("public"))
app.use(express.json());

app.use(require("./modules/authentication/authentication"));

module.exports = app;