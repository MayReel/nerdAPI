const express = require('express')
const router = express.Router()
const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '../variable/.env') });


//connectDB
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
            console.log('[ERROR } Con.connect: ' + err.message);
            return err;
        }
        console.log('Connect to MySQL server')
    })
    return con;
}

router.get('/', async (req, res) => {
    const con = await connectToDB();
    try {
        const [results] = await con.query(
            "SELECT u.id, u.fname, u.lname, o.product_item FROM users u JOIN `order` o ON u.order_ID = o.order_ID"
        );
        return res.json(results);
    } catch (err) {
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
        return res.status(400).send({ error: true, message: err.message, data: null });
    } finally {
        await con.end();
    }
});


module.exports = router;

