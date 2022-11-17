if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}




const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const passport = require("passport")
const initializePassport = require("./passport-config")
const flash = require("express-flash")
const session = require("express-session")
const path = require('path')

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
    )



const users= []


app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false

}))
app.use(passport.initialize())
app.use(passport.session())



app.use( express.static(path.join(__dirname, 'public')))

app.post("/mainpage", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/mainpage",
    failureFlash: true
}))






app.post("/register", async (req,res) =>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email:req.body.email,
            password: hashedPassword,
        })
        console.log(users);
        res.redirect("/mainpage")
    } catch (e) {
        console.log(e);
        res.redirect("/register")
    }
})

app.get('/',(req,res) =>{
    res.render("homepage.ejs")
})

app.get('/mainpage',(req,res) =>{
    res.render("mainpage.ejs")
})

app.get('/register',(req,res) =>{
    res.render("register.ejs")
})



app.listen(3000)