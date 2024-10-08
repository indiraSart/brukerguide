const express  = require("express");
const { connected } = require("process");
const { stringify } = require("querystring");
const app = express();
require("dotenv").config();

const mongoose =  require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt")
const multer = require("multer");
const uploads = multer({dest: "uploads/"})


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({externded: true}));

mongoose.connect("mongodb://127.0.0.1:27017/helpdesk")
.then(() => console.log("connected!"))
.catch((error) => console.log("error", error))
const saltRounds = 10;

const userSchema = new Schema ({

    email: String,
    password: String,
})

const User = mongoose.model("user", userSchema);


app.get("/", (req, res) => {
    res.render("index")

})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", (req, res) => {
   console.log("LOGGER UT HER", req.body);
   const { email, password } = req.body;

   if(email) {

       
       User.findOne({email: email}).then((user) => {
           console.log(user, "USER");
           if(user) {
               bcrypt.compare(password, user.password).then((result) => {
                   console.log(result);
                   if(result) {
                    res.status(200).redirect("/dashboard")
                   }
                })
                
            }
            
        })
        
    }
})



app.get("/guide", (req, res) => {
    res.render("guide")
})



app.get("/createuser", (req, res) => {
    res.render("createuser")
})

app.post("/createuser", async (req, res) => {
    console.log(req.body)
    const {email, password, gjentapassword} = req.body;
 
        const newUser = new User ({email: email, password: password})
        
    if(password == gjentapassword) {
        bcrypt.hash(password, saltRounds, async function(error, hash) {
            const newUser = new User({email: email, password: hash})
            const result = await newUser.save();
            console.log(result, "RESULT");
            
            
            if(result._id) {
                res.redirect("/dashboard");
            }
            
        })
    }
        


 })


 app.get("/dashboard", (req, res) => {
    res.render("dashboard")
})

app.get("/nyguide", (req, res) => {
    res.render("nyguide")
})

app.post("/nyguide", uploads.single(), (req, res) => {
    console.log("REQ BODY", req.body);
    console.log("REQ FILE", req.file);

})



app.listen(process.env.PORT);
