const express  = require("express");
const app = express();
require("dotenv").config();


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({externded: true}));



app.get("/", (req, res) => {
    res.render("index")

})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/guide", (req, res) => {
    res.render("guide")
})



app.listen(process.env.PORT);
