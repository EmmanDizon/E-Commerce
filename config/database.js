const mongoose = require("mongoose");

const connectDB = () => {
  mongoose.set("runValidators", true); // here is your global setting
  mongoose
    .connect(process.env.DB_LOCAL_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log(`Connected to mongoDB with host: ${res.connection.host}`);
    });
};

module.exports = connectDB;
