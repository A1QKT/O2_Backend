const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = class Token {
    constructor (_id, email, role, payload, expiredIn = "24h") {
        this._id = _id;
        this.email = email;
        this.role = role;
        this.payload = payload;
        this.expiredIn = expiredIn;
    }
    get sign(){
        return jwt.sign({...this.payload, id: this._id, role: this.role, email: this.email}, config.get("secret"), {expiresIn: this.expiredIn});
    }
    static decode(token){
        if(!token) {
            throw Error("Missing token");
        }
        const {_id, role, payload} = jwt.decode(token, config.get("secret"));
        return new Token(_id, role, payload);
    }
}