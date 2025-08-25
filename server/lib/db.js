import mongoose from "mongoose";

//Function to connect to the mongodb database
export const connectDB = async () => {
  try {

    mongoose.connection.on('connected', ()=> console.log ('Database Connected'))
    await mongoose.connect(`${process.env.MONGO_URL}/chat-app`)
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}