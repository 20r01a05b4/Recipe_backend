    const mongoose = require("mongoose");

    const schema = async (obj, username) => {
        try {
            const uri = "mongodb+srv://saikumar:Venkanna@cluster0.htntddq.mongodb.net/?retryWrites=true&w=majority";
            await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
            const db = mongoose.connection;
            const collections = db.collection("card_details");
    
            const existingObj = await collections.findOne({ username: username, "details": obj });
    
            if (existingObj) {
                return "already";
            } else {
                await collections.updateOne(
                    { username: username },
                    { $push: { details: obj } },
                    { upsert: true }
                );
    
                return "success";
            }
        } catch (error) {
            console.error(error);
            return "error";
        } 
    };
    
    module.exports = schema;
    