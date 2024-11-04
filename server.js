require('dotenv').config({ path: require('path').join(__dirname, '../variable/.env') });
var express = require('express')
var cors = require('cors')
const Port = process.env.PORT;
const user = require('./api/user')
const order = require('./api/order')

var app = express()
app.use(express.json())
app.use(cors())


app.use('/user', user);
app.use('/order', order);

app.listen(Port, function () {
  console.log(`CORS-enabled web server listening on port ${Port}.`)
})