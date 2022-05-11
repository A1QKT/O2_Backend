const express = require("express");
const Plan = require("./plan.model");
const config = require("config");
const Token = require("../../script/token");

const router = express.Router();

router.post("/create-plan", async (req, res) => {
    try{
        const token = Token.decode(req.headers["x-token"]);
        if (!token) {
            res.status(401).send("Unauthored query");
        }
        const {longtitude, latitude} = req.body;
        if (!longtitude || !latitude) { 
            res.status(400).send("All input is required");
        }
        const oldPlan = await Plan.findOne({latitude: latitude, longtitude: longtitude});
        if (oldPlan) {
            res.status(409).send("Plan already existed");
        }
        const plan = await Plan.create({
            level: 0,
            experience: 0,
            longtitude: longtitude,
            latitude: latitude,
        });
        res.status(200).json(plan);
    }
    catch (error) {
        console.log(error);
        res.send({status: `${error}`});
    }
});

router.get("/get-one-plan", async (req, res) => {
    try{
        const token = Token.decode(req.headers["x-token"]);
        if (!token) {
            res.status(401).send("Unauthored query");
        }
        const {latitude, longtitude} = req.body;
        if(!latitude || !longtitude) {
            res.status(400).send("All input are required");
        }
        const plan = await Plan.findOne({
            latitude: latitude,
            longtitude: longtitude,
        })
        res.status(200).json(plan);
    }
    catch (error) {
        console.log(error);
        res.send({status: `${error}`});
    }
})

router.get("/get-all-plan", async (req, res) => {
    try{ 
        const token = Token.decode(req.headers["x-token"]);
        if (!token) {
            res.status(401).send("Unauthored query");
        }
        res.status(200).json(await Plan.find({}));
    }
    catch (error) {
        console.log(error);
        res.send({status: `${error}`});
    }
})

router.get("/get-plan-around", async (req, res) => {
    try{
        const token = Token.decode(req.headers["x-token"]);
        if (!token) {
            res.status(401).send("Unauthored query");
        }
        const {distance, longPerson, laPerson} = req.body;
        if(!distance || !longPerson || !laPerson){
            res.status(400).send("All input is required");
        }
        const plans = await Plan.aggregate([{
                $match: {
                    distance: {
                        $gte: {
                            $sqrt: {
                                $add: [
                                    { $pow: [ { $subtract: [ "$longtitude", longPerson ] }, 2 ] },
                                    { $pow: [ { $subtract: [ "$latitude", laPerson ] }, 2 ] }
                                ]
                            }
                        }
                    }
                }
            }]);
        res.status(200).json(plans);
    }
    catch (error){
        console.log(error);
        res.send({status: `${error}`});
    }
})

router.post("/update-plan", async (req, res) => {
    try{
        const token = Token.decode(req.headers["x-token"]);
        if (!token) {
            res.status(401).send("Unauthored query");
        }
        const {experience, latitude, longtitude} = req.body;
        if(!experience || !latitude || !longtitude){
            res.status(400).send("All input are required");
        }
        let plan = await Plan.findOne({latitude: latitude, longtitude: longtitude});
        if(plan.experience + experience > config.get("experience_threshold")){
            plan = await Plan.findOneAndUpdate({
                latitude: latitude,
                longtitude: longtitude
            },{
                experience: 0,
                $inc: {level: 1},
            }, {new: true});
            res.status(200).json(plan);
        }
        else {
            plan = await Plan.findOneAndUpdate({
                latitude: latitude,
                longtitude: longtitude
            },{
                $inc: {
                    experience: experience,
                }
            }, {new: true});
            res.status(200).json(plan);
        }
    }
    catch (error) {
        console.log(error);
        res.send({status: `${error}`});
    }
})

router.post("/delete", async (req, res) => {
    try{
        const token = Token.decode(req.headers["x-token"]);
        if (!token || !token.payload["admin"]) {
            res.status(401).send("Unauthored query");
        }
        const {latitude, longtitude} = req.body;
        if(!latitude || !longtitude) {
            res.status(400).send("All input are required");
        }
        const plan = Plan.findOneAndRemove({
            latitude: latitude,
            longtitude: longtitude,
        });
        res.status(200).json(plan);
    }
    catch (error){
        console.log(error);
        res.send({status: `${error}`});
    }
})

module.exports = router;