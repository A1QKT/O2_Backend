const config = require("config");
const mongoose = require("mongoose");

const MONGO_URI = config.get("mongo.uri");

module.exports = async function connect () {
    await mongoose.connect(MONGO_URI)
        .then(
            () => {
                console.log("connected to mongo")
            }
        )
        .catch(
            (error) => {
                console.log("connect to mongo fail")
                console.error(error);
            }
        )
}