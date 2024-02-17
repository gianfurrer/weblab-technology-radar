import { login, logout } from "@src/controllers/authenticationController";
import { Router } from "express";
import { body } from "express-validator";
import { isAuthenticated } from "./middleware/auth";

const router = Router();

const loginValidation = [
  body("email").notEmpty().isEmail().toLowerCase(),
  body("password").notEmpty().isLength({ min: 8 }),
];

router.post("/login", loginValidation, login);
router.post("/logout", isAuthenticated, logout);

export const AuthenticationRouterV1 = router;
