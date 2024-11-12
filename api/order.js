//----------------------------- 
const express = require('express')
const router = express.Router()
const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '../variable/.env') });
//----------------------------- 


//----------------------------- 
const winston = require('winston');
const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = winston;
const dailyRotateFileTransport = require('winston-daily-rotate-file');
const logDir = 'log';
const env = process.env.NODE_ENV || "development";

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
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`))
  })
};

const logger = createLogger({
  level: env === 'development' ? 'debug' : 'info',
  format: format.combine(
    format.label({ label: path.basename(process.mainModule.filename) }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
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
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      )
    })
  ]
});
//----------------------------- 

//----------------------------- Connect database 
async function connectToDB(){
    const con = await mysql.createConnection({
        host: process.env.hostDB,
        user : process.env.userDB,
        password : process.env.passwordDB,
        database : process.env.Database
    });

    con.connect((err) => {
        if(err){
            logger.error(err.message)
            console.log('[ERROR ] Con.connect: ' + err.message);
            return err;
        }
        console.log('Connect to MySQL server')
    })
    return con;
}
//----------------------------- 

//----------------------------- api
router.get('/', async (req, res) => {
    const con = await connectToDB();
    try {
        const [results] = await con.query(
            "SELECT u.id, u.fname, u.lname, o.product_item FROM users u JOIN `order` o ON u.order_ID = o.order_ID"
        );
        return res.json(results);
    } catch (err) {
        logger.error(req.originalUrl + " => " + error.message);
        return res.status(400).send({ error: true, message: err.message, data: null });
    } finally {
        await con.end();
    }
});

router.get('/:id', async (req, res) => {
    const con = await connectToDB();
    const id = req.params.id;
    try {
        const [results] = await con.query(
            "SELECT u.id, u.fname, u.lname, o.product_item FROM users u JOIN `order` o ON u.order_ID = o.order_ID WHERE u.id = ?",
            [id]
        );
        return res.json(results);
    } catch (err) {
        logger.error(req.originalUrl + " => " + error.message);
        return res.status(400).send({ error: true, message: err.message, data: null });
    } finally {
        await con.end();
    }
});
//----------------------------- 

module.exports = router;

