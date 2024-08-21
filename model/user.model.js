import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    chatHistory: [{ type: String }]
});
  
export const User = mongoose.model('User', userSchema);