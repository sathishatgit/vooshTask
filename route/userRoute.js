import express from "express";
import {
  userAuth,
  userSignin,
  userSignup,
} from "../controller/userController.js";

const userRoute = express.Router();

userRoute.post("/signin", userSignin);
userRoute.post("/signup", userSignup);
userRoute.post("/auth", userAuth);

export default userRoute;
