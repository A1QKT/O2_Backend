const config = require("config");
const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const port = config.get("port") || 80;

server.listen(port, () => {
    console.log(`server listen on port ${port}`);
})