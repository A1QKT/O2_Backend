const express = require("express");
const Plan = require("./plan.model");
const config = require("config");

const router = express.Router();

router.post("/create-plan", async (req, res) => {
    try{
        const {longtitude, latitude} = req.body;
        if(!longtitude || !latitude){
            res.status(400).send("All input is required");
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
    }
});

router.get("/get-one-plan", async (req, res) => {
    try{
        const {latitude, longtitude} = req.body;
        const plan = await Plan.findOne({
            latitude: latitude,
            longtitude: longtitude,
        })
        res.status(200).json(plan);
    }
    catch (error) {
        console.log(error);
    }
})

router.get("/get-all-plan", async (req, res) => {
    try{ 
        res.status(200).json(await Plan.find({}));
    }
    catch (error) {
        console.log(error);
    }
})

router.get("/get-plan-around", async (req, res) => {
    const {distance, longPerson, laPerson} = req.body;
    if(!distance || !longPerson || !laPerson){
        res.status(400).send("All input is required");
    }
    try{
        
    }
    catch (error){
        console.log(error);
    }
})

router.post("/update-plan", async (req, res) => {
    try{
        const {experience, latitude, longtitude} = req.body;
        if(experience > config.get("experience_threshold")){
            const plan = await findOneAndUpdate({
                latitude: latitude,
                longtitude: longtitude
            },
            {
                $set: {experience: 0},
                $inc: {level: 1}
            });
            res.status(200).json(plan);
        }
    } 
    catch (error) {
        console.log(error);
    }
})

router.post("/update-experience", async (req, res) => {
    const {addExperience} = req.body;

})
// router.post("/delete", async (req, res) => {
//     const {latitude, longtitude} = req.body;
//     if(!latitude || !longtitude) {
//         res.status(400).send("All input are required");
//     }
// })

module.exports = router;