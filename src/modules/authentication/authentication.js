const express = require("express");
const User = require("../user/user.model");
const bcrypt = require("bcryptjs");
const validateEmail = require("../../script/email-validation");
const Token = require("../../script/token");

const router = express.Router();

router.post("/signup", async (req, res) => {
    try{
        const {firstname, lastname, email, password} = req.body;
        if(!firstname || !lastname || !email || !password){
            res.status(400).send("All input is required");
        }

        if(!validateEmail(email)){
            res.status(400).send("Invalid email");
        }

        const oldUser = await User.findOne({email});
        if(oldUser) {
            res.status(409).send("User already exist. Please login");
        }

        encryptedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstname: firstname,
            lastname: lastname,
            username: `${firstname} ${lastname}`,
            email: email,
            password: encryptedPassword,
        });
        user.token = new Token(user._id, user.email, "user", {}).sign;
        res.status(201).json(user);
    }
    catch (error) {
        console.log(error);
        res.send({status: `${error}`});
    }
})

router.post("/login", async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password ){
            res.status(400).send("All input is required");
        }
        if(!validateEmail(email)){
            res.status(400).send("Invalid email");
        }
        
        const user = await User.findOne({email});
        if(user && await bcrypt.compare(password, user.password)) {
            console.log("some thing login");
            user.token = new Token(user._id, user.email, "user", {}).sign;
            console.log(user.token);
            res.status(200).json(user);
        }
        else{
            res.status(400).send("Invalid Credential")
        }
    }
    catch (error) {
        console.log(error);
        res.send({status: `${error}`});
    }
})

module.exports = router;