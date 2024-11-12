//----------------------------- 
require('dotenv').config({ path: require('path').join(__dirname, '../variable/.env') });
var express = require('express')
var cors = require('cors')
const Port = process.env.PORT || 5000;
var app = express()
app.use(express.json())
app.use(cors())
const env = process.env.NODE_ENV || "development";
const ip = require("ip");
//----------------------------- 


//----------------------------- api path
const user = require('./api/user')
const order = require('./api/order')
//----------------------------- 



//----------------------------- log
const winston = require('winston');
const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = winston;
const dailyRotateFileTransport = require('winston-daily-rotate-file');
const logDir = 'log';

// Create log directory if it doesn’t exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const transportsOption = {
  console: new transports.Console({
    level: 'warn',
    format: format.combine(
      format.colorize(),
      format.simple(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)
    )
  }),
  file: new winston.transports.File({ filename: 'combined.log', level: 'error' ,
    format : format.combine(
        format.colorize(), 
        format.json(),
        format.timestamp({
            format : 'YYYY-MM-DD HH:mm:ss' 
        }),
        format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`))
  })
};

const logger = createLogger({
  level: env === 'development' ? 'debug' : 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)
  ),
  transports: [
    transportsOption.console,
    new dailyRotateFileTransport({
      filename: `${logDir}/%DATE%-results.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '14d',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)
      )
    })
  ]
});
//----------------------------- 

//----------------------------- api
app.use('/user', user);
app.use('/order', order);
//-----------------------------


//----------------------------- port
app.listen(Port, "0.0.0.0" , () => {
  console.dir(ip.address());
  console.log(`Node App is running on ${ip.address()}:${Port}`);
})
//----------------------------- 