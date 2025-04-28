import express from "express";
import { register, login } from "../controllers/authController.js";
import { check } from "express-validator";

const router = express.Router();

/** REGISTER ROUTE */
router.post(
    "/register",
    [
        check("username", "Username is required").not().isEmpty(),
        check("email", "Valid email is required").isEmail(),
        check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    ],
    register
);

/** LOGIN ROUTE */
router.post("/login", login);

export default router;

