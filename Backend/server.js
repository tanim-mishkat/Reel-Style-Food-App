const http = require('http');
const app = require('./src/app.js');
const connectDB = require('./src/db/db.js');
const { initRealtime } = require('./src/socket/index.js');
const dotenv = require('dotenv').config()


const PORT = process.env.PORT || 3000;

connectDB()

const server = http.createServer(app);
initRealtime(server);

server.listen(PORT, () => {
    console.log(`Server listening on port:${PORT}`);
});
