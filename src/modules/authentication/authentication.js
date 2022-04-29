const express = require("express");
const User = require("../user/model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const validateEmail = require("../../script/emailValidation");

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
        })
        
        const token = jwt.sign(
            {
                user_id: user._id,
                email: user.email,
            },
            config.get("secret"),
            {
                expiresIn: "2h",
            }
        )
        user.token = token;
        
        res.status(201).json(user);
    }
    catch (error) {
        console.log(error);
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
            const token = jwt.sign(
                {
                    user_id: user._id,
                    email: email
                },
                config.get("secret"),
                {
                    expiresIn: "2h"
                }
            )
            user.token = token;
            user.firstname = "lol khanh";
            res.status(200).json(user);
        }
        else{
            res.status(400).send("Invalid Credential")
        }
    }
    catch (error) {
        console.log(error);
    }
})

module.exports = router;