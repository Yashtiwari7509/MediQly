import mongoose from "mongoose";
function connectToDb() {
  //Set up default mongoose connection
  mongoose
    .connect(process.env.MONGOOSE_URI)
    .then(() => {
      console.log("db connected successfully");
    })
    .catch((err) => {
      console.log(err, "db");
    });
}

export default connectToDb;
