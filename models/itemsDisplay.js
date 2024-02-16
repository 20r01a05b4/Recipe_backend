const mongoose = require("mongoose");

const Bookmark=async(username)=>{
   console.log("book marks")
    const uri = "mongodb+srv://saikumar:Venkanna@cluster0.htntddq.mongodb.net/?retryWrites=true&w=majority";
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    const db = mongoose.connection;
    const collections = db.collection("card_details");
    const data = await collections.findOne({ username:username});
    return data;
}

module.exports = Bookmark;