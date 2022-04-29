const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const {API_PORT} = process.env;

const port = process.env.PORT || 80;

server.listen(port, () => {
    console.log(`server listen on port ${port}`);
})