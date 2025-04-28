import mongoose from "mongoose";
import Movie from "../models/movieModel.js";  // Updated model to 'movieModel.js'

/** CREATE a new movie */
export const createMovie = async (req, res) => {
    try {
        console.log("📌 Received Request Body:", req.body);  // Debugging Line
        const { title, director, genre, releaseYear } = req.body;

        if (!title || !director || !genre || !releaseYear) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newMovie = new Movie({ title, director, genre, releaseYear });
        await newMovie.save();

        res.status(201).json({ message: "Movie added successfully", movie: newMovie });
    } catch (error) {
        console.error("❌ Error creating movie:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};

/** GET all movies */
export const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

/** GET a single movie by ID */
export const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Movie ID" });
        }

        const movie = await Movie.findById(id);
        if (!movie) return res.status(404).json({ message: "Movie not found" });

        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

/** UPDATE a movie */
export const updateMovie = async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMovie) return res.status(404).json({ message: "Movie not found" });
        res.json({ message: "Movie updated successfully", movie: updatedMovie });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

/** DELETE a movie */
export const deleteMovie = async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (!deletedMovie) return res.status(404).json({ message: "Movie not found" });
        res.json({ message: "Movie deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};
