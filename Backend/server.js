const app = require('./src/app.js')
const connectDB = require('./src/db/db.js')

app.listen(3000, () => {
    console.log('Server is running on port 3000')
    connectDB();
})