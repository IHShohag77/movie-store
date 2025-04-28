import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    genre: { type: String, required: true },
    releaseYear: { type: Number, required: true }
}, {
    timestamps: true
});

export default mongoose.model("Movie", MovieSchema);

