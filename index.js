const express = require('express');
const app = express();
const cors = require('cors');
const DB = require('./db');
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const { query } = require('express');
const auth = require('./middleware/auth')
const authUser= require('./basicAuth')
require("dotenv").config;



//middileware 
app.use(cors());
app.use(express.json());

app.get('/',(req, res, next)=>{
  res.send("home page")
})

app.post('/register', async (req, res, next) => {
  const db = await DB();
  const { email, name, password } = req.body
  try {
    var query = `SELECT * FROM users WHERE email='${email}'`;
    var result = await db.query(query);
    console.log("all details", result);
    if (result.rowCount> 0) {
      return res.status(400).json("user already exist")
    } else {
      const salt = await bcrypt.genSalt(8);
      const bycrpass = await bcrypt.hash(password, salt)
      var query = `INSERT INTO users(email, name, password) VALUES ('${email}','${name}','${bycrpass}' )RETURNING *`
      let newUser = await db.query(query)
      newUser.message = "user created succesfully";
      res.status(200).json(newUser.rows[0])
    }


  } catch (err) {
    next(err)
    console.log("error while register", err);
  }
})

app.post('/login',  async (req,res, next)=>{
  const db = await DB();
  const {email, password}=req.body;
  try{
    var query = `SELECT * FROM users WHERE email='${email}'`;
    var result = await db.query(query)
    console.log("all details", result);
    if(result.rows[0]==0){
      return res.status(401).json("email not registered")
    }else{
      const hashpass = result.rows[0].password;
      console.log("hasspass",hashpass );
      const validPass = await bcrypt.compare(password, hashpass)
      
     
      if(validPass){
        const payload = {
          email: result.rows[0].email,
          password:result.rows[0].password
        }
          const token = jwt.sign(payload, process.env.SECRETTOKEN)
         console.log("token",token);

        return res.status(401).json("login succs")
         


      }else{
        return res.status(401).json("failed")
      }
    }
   
  
  }catch(err){
    next(err)
    console.log("error while login", err);
    

  }
})



app.post('/post',auth, async (req, res, next) => {
  console.log("calling api");
  const db = await DB();
  try {
    const { description } = req.body;
    var query = `INSERT INTO public.todo(description) VALUES ('${description}' )RETURNING *`
    console.log(query);
    var result = await db.query(query);
    console.log("result", result);
    result.message = "todo added succesfully"
    res.status(200).json(result)

  } catch (err) {
    console.log("erron in adding new todo", err);
    next(err);
  } finally {
    db.close();
  }
});

app.get('/gettodos', async (req, res, next) => {
  console.log("calling apui");
  const db = await DB();
  try {
    result = {}
    const query = `SELECT * FROM public.todo;`
    var result = await db.query(query);
    console.log("result", result);
    result.message = "todo all fetched succesfully"
    res.status(200).json(result)
  } catch (err) {
    console.log("error", err);
    next(err);
  } finally {
    db.close()
  }
})


app.delete('/delete/:id', async (req, res, next) => {
  const db = await DB();
  const { id } = req.params;
  try {
    var result = {};
    var query = `DELETE from todo where id='${id}'`;
    var result = await db.query(query);
    result.message = "deleted todo successfull";
    res.status(200).json(result);
  } catch (err) {
    console.log("error", err);
    next(err)
  } finally {
    db.close()
  }
})

app.put('/update/:id', async (req, res, next) => {
  const db = await DB();
  const { id } = req.params;
  try {
    var result = {};
    const { description } = req.body;
    var query = `UPDATE todo SET description='${description}' where id='${id}' RETURNING *`;
    var result = await db.query(query);
    console.log(result);
    result.message = "update succesfull";
    res.status(200).json(result)
  } catch (err) {

    console.log("error", err);
    next(err)
  } finally {
    db.close()
  }
})

app.listen(8080, () => {
  console.log("server listening the port number is 8080");
})

