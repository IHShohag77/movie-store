

import { expect } from "chai";
import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js";
import Movie from "./models/movieModel.js";
import app from "./index.js";

dotenv.config();

const logResponse = (testName, res) => {
  console.log(`\n----- ${testName} Response -----`);
  console.log(`Status: ${res.status}`);
  console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
  console.log(`Body: ${JSON.stringify(res.body, null, 2)}`);
  console.log('------------------------------\n');
};

describe("Movie & Auth API Tests", function () {
  this.timeout(10000);
  let movieId;
  let authToken;
  let testUser = { username: "testuser", email: "testuser@example.com", password: "password123" };

  before(async () => {
    await mongoose.disconnect();
    await mongoose.connect(process.env.MONGODB_URI_TEST);
    await User.deleteMany();
    await Movie.deleteMany();
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    logResponse("User Registration", res);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("message").equal("User registered successfully");
  });

  it("should log in the user", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: testUser.email, password: testUser.password });
    logResponse("User Login", res);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
    authToken = res.body.token;
  });

  it("should create a new movie", async () => {
    const movieData = { title: "Test Movie", director: "Jane Doe", genre: "Action", releaseYear: 2024 };
    const res = await request(app).post("/api/movies").set("Authorization", `Bearer ${authToken}`).send(movieData);
    logResponse("Create Movie", res);
    expect(res.status).to.equal(201);
    movieId = res.body.movie._id;
  });

  it("should fetch all movies", async () => {
    const res = await request(app).get("/api/movies");
    logResponse("Fetch All Movies", res);
    expect(res.status).to.equal(200);
  });

  it("should fetch a single movie by ID", async () => {
    const res = await request(app).get(`/api/movies/${movieId}`);
    logResponse("Fetch Single Movie", res);
    expect(res.status).to.equal(200);
  });

  it("should update a movie", async () => {
    const updateData = { title: "Updated Test Movie" };
    const res = await request(app).put(`/api/movies/${movieId}`).set("Authorization", `Bearer ${authToken}`).send(updateData);
    logResponse("Update Movie", res);
    expect(res.status).to.equal(200);
  });

  it("should delete a movie", async () => {
    const res = await request(app).delete(`/api/movies/${movieId}`).set("Authorization", `Bearer ${authToken}`);
    logResponse("Delete Movie", res);
    expect(res.status).to.equal(200);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
