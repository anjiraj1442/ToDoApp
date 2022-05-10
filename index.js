const express = require('express');
const app = express();
const cors = require('cors');
const DB = require('./db');


//middileware 
app.use(cors());
app.use(express.json());

app.post('/post', async (req, res, next) => {
  console.log("calling api");
  const db = await DB();
  try{
   const {description} = req.body;
   var query= `INSERT INTO public.todo(description) VALUES ('${description}' )RETURNING *`
  console.log(query);
  var result = await db.query(query);
  console.log("result", result);
  result.message="todo added succesfully"
  res.status(200).json(result)

}catch(err){
      console.log("erron in adding new todo", err);
      next(err);
  }finally{
    db.close();
  }
});

app.get('/gettodos', async (req,res,next)=>{
  console.log("calling apui");
  const db = await DB();
    try{
      result={}
      const query = `SELECT * FROM public.todo;`
      var result = await db.query(query);
      result.message="todo all fetched succesfully"
      res.status(200).json(result)
    }catch(err){
        console.log("error", err);
        next(err);
    }
})


app.listen(8080,()=>{
    console.log("server listening the port number is 8080");
})