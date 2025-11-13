const mongoose = require("mongoose");

const connectDb = async ()=>{
    try {
         await mongoose.connect(process.env.MONGO_URL);
         console.log("DB Connected");
    } catch(error) {
         console.log("DB Connection Failed ", error);
    }
}

module.exports = {
    connectDb
}
// mongodb+srv://mahendrawarman:0jgeNqQ7pnSrxBth@cluster0.ynyorab.mongodb.net/?appName=Cluster0