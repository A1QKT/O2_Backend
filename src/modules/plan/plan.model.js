const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    longtitude: {type: Number, require: true},
    latitude: {type: Number, require: true},
    level: {type: Number, require: true, default: 0},
    experience: {type: Number, require: true, default: 0}
});

module.exports = mongoose.model("plan", planSchema);