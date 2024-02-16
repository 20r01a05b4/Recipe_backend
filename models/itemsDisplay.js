const mongoose = require("mongoose");

const Bookmark=async(username)=>{
   console.log("book marks")
    const uri =process.env.url
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    const db = mongoose.connection;
    const collections = db.collection("card_details");
    const data = await collections.findOne({ username:username});
    return data;
}

module.exports = Bookmark;
