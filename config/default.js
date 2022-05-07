const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    secret: null,
    experience_threshold: null,
    port: null,
    mongo: { 
        uri: null
    },
}