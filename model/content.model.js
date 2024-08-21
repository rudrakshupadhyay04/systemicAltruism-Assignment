import mongoose from "mongoose";


const contentSchema = new mongoose.Schema({
    title: String,
    videoUrl: String,
    lyrics: String,
    background: String
});

export const Content = mongoose.model('Content', contentSchema);