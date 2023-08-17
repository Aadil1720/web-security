require('dotenv').config();
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption")

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true});
/////////////////Level-2///////////////////////////////////////////
const userSchema=new mongoose.Schema({ // this type of schema is needed when we want to encrypt the data
    email:String,
    password:String
});
userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ['password']});
//////////////////////////////////////////////////////////////////////
const User=new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/register",(req,res)=>{
    res.render("register");
})
///////////////////level-1////////
app.post("/register",async(req,res)=>{
    const newUser=new User({
        email: req.body.username,
        password:req.body.password
    });
    await newUser.save().then(savedItem=>{
        res.render("secrets")
    }).catch(err=>{
        console.log(err);
    })
});

app.post("/login",async(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
   const user= await User.findOne({email:username});
   if(!user) res.send("Invalid Credentials");
   else{
    if(user.password===password) res.render("secrets");
    else res.send("Invalid Credentials");
   }
})
///////////////////////////////////////////////////////////

app.listen("3000",()=>{
    console.log("Server is running at port 3000");
})