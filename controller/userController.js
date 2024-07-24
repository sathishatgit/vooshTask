import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userSignin = async (req, res) => {
  const UserData = req.body;

  const info = await User.findOne({ emailId: UserData.emailId });
  if (info) {
    const isPasswordvaild = await bcrypt.compare(
      UserData.password,
      info.password
    );
    if (isPasswordvaild) {
      const userTokenData = {
        emailId: info.emailId,
        name: info.name,
      };
      const token = jwt.sign(userTokenData, process.env.JWT_KEY, {
        expiresIn: "1h",
      });
      res.status(200).send({ userTokenData, authToken: token });
    } else res.status(400).send("invalid username or password");
  } else res.status(400).send("invalid username");
};

export const userSignup = async (req, res) => {
  const reqData = req.body;
  console.log(reqData);
  try {
    const newUser = new User(reqData);
    const salt = await bcrypt.genSalt(10);
    const hashing = await bcrypt.hash(newUser.password, salt);
    newUser.password = hashing;
    newUser.name = newUser.firstName + " " + newUser.lastName;
    const addedUser = await newUser.save();
    res.send("User Created SucessFuly");
  } catch (error) {
    console.log("Error Message", error);
    if (error.code == 11000) res.status(400).send("email id already exists");
    else res.status(500).send("Something went wrong");
  }
};

export const userAuth = async (req, res) => {
  try {
    const token = req.body.auth;
    const decodeToken = jwt.verify(token, process.env.JWT_KEY);
    res.send({ userAuth: decodeToken });
  } catch (error) {
    res.status(202).send("Something went wrong");
  }
};
