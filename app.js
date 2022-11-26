const express = require("express");
const app = express();
const mongoose=require('./config/mongoose');
const Family=require('./models/family');

var cors = require("cors");

app.use(cors());
var bodyParser = require('body-parser')


// parse application/json
app.use(bodyParser.json())

app.post('/add',async (req,res)=>{
    const newMember=await Family.create(req.body);
    console.log(newMember)
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ Message:`Added ${req.body.name} to family...` }));
});

app.get('/clean',async (req,res)=>{
    const family=await Family.deleteMany({});
    console.log(family);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Ready for fresh data...' }));
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));