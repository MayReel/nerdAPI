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
//Show all user
router.get('/', async (req,res) =>{
    const con = await connectToDB();
    try{
        const [results] = await con.query("SELECT * FROM `users`");
        res.json(results)
    }
    catch(err){
        return res.status(400).send({ error: true, message: error.message, data: null });
    }
    finally{
        await con.end()
    }
})

//Show by ID
router.get('/:id', async (req,res)=>{
    const con = await connectToDB();
    const id = req.params.id;
    try{
        const [results] = await con.query('SELECT * FROM `users` WHERE id = ?', [id])
        return res.json(results)
    }
    catch(err){
        return res.status(400).send({ error: true, message: error.message, data: null });
    }
    finally{
        await con.end()
    }
})

//Add a new user
router.post('/', async (req, res) => {
    const con = await connectToDB();
    try {
        const [results] = await con.query(
            'INSERT INTO `users` (`fname`, `lname`, `username`, `age`, `order_ID`) VALUES (?,?,?,?,?)',
            [req.body.fname, req.body.lname, req.body.username, req.body.age, req.body.order_ID]
        );
        return res.json(results);
    } catch (err) {
        return res.status(400).send({ error: true, message: err.message, data: null });
    } finally {
        await con.end();
    }
});

//Update data
router.put('/',async(req,res) =>{
    const con = await connectToDB();
    try{
        const [results] = await con.query(
            'UPDATE `users` SET `fname` = ?, `lname` = ?, `username` = ?,`age` = ?,`order_id` = ? WHERE `id` = ?',
            [req.body.fname,req.body.lname,req.body.username,req.body.age,req.body.order_ID,req.body.id]
        )
        return results;    
    }    
    catch(err){
        return res.status(400).send({ error: true, message: error.message, data: null });
    }
    finally{
        await con.end()
    }
})

//Delete by id
router.delete('/:id', async(req,res) => {
    const con = await connectToDB();
    try{
        const [results] = await con.query(
            'DELETE FROM `users` WHERE `id` = ?',[req.params.id]
        )
        return res.json(results);
    }
    catch(err){
        return res.status(400).send({ error: true, message: error.message, data: null });
    }
    finally{
        await con.end()
    }
})



module.exports = router