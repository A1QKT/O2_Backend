const express = require("express");
const bodyParser =require("body-parser");
require("./helpers/mongo")();

const app = express();

app.use(express.static("public"))
app.use(express.json());

app.get("/", (req, res) => {
    res.send("hello O2");
})

app.use(require("./modules/authentication/authentication"));
app.use(require("./modules/plan/CRUDPlan"));

module.exports = app;