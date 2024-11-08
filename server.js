require('dotenv').config({ path: require('path').join(__dirname, '../variable/.env') });
var express = require('express')
var cors = require('cors')
const Port = process.env.PORT;
const user = require('./api/user')
const order = require('./api/order')

var app = express()
app.use(express.json())
app.use(cors())



const env = process.env.NODE_ENV || "development";
const logDir = "log";
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const backupDir = "backup";
// Create the backup directory if it does not exist
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
}

const imageDir = "img";
// Create the image directory if it does not exist
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
}

app.use('/user', user);
app.use('/order', order);

app.listen(Port, function () {
  console.log(`CORS-enabled web server listening on port ${Port}.`)
})