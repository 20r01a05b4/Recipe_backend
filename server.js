const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cart=require("./models/cart")
const sendotp=require("./models/sendotp")
const Bookmark=require("./models/itemsDisplay")

const app = express();
app.use(express.json());
app.use(cors());
const port = 500;
const secret_key="223ndiodkdsj11223r3"

const db_url =
  "mongodb+srv://saikumar:Venkanna@cluster0.htntddq.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("db connected successfully sai");
  })
  .catch((err) => {
    console.log(err);
  });

//sendotp to the user email or phone number
const otp_sceret="otp234buikfijfdvj"
const otp = Math.floor(100000 + Math.random() * 900000);
 app.post("/sendotp",async(req,res)=>{
      const {username}=req.body;
      const token=await sendotp(username,otp,otp_sceret)
      console.log(token)
      if(token==="error"){
       return res.json({message:"error"})
      }
      else{
        return res.json({message:token})
      }
      console.log(token)
 })
 

// User model schema
const User = mongoose.model("User", {
  username: String,
  password: String,
});

// Register endpoint
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body; 
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOne({ username});
    if(user){
      res.json({message:"username already present"});
      return;

    }
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    // Finding user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ error:"Username Not Found" });
    }
    // Comparing passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ error: "Invalid credentials" });
    }
    // Generating jwt  token
    const token = jwt.sign({ username: user.username }, secret_key, {
      expiresIn: "1h", 
    });
    res.json({"token":token});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// authenticating JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.sendStatus(401);
  }
  jwt.verify(token,secret_key,(err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

// Protected route example
app.post("/addcart", async(req, res) => {
  const { recipe, username } = req.body;
  const response=await cart(recipe,username,res);
  console.log(response)
  if(response==="success"){ 
   res.json({"msg":"success"});
  }
  else if(response==="error"){
    res.json({"msg":"error"})
  }
  else if(response==="already"){
    res.json({"msg":"already"})
  }
 
});

/*total recipes in bookmark*/
app.post("/bookmark",async(req,res)=>{
  const {username}=req.body
  const response=await Bookmark(username);
  res.json({"msg":response})
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
