const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    secret: null,
    port: null,
    mongo: { 
        uri: null
    },
}