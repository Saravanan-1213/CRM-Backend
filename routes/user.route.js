import express from "express";
import bcrypt from "bcrypt";
import {
  createUser,
  generateHashedPassword,
  getUserByName,
} from "../services/user.services.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST(create) movies using POSTMAN // post => request

router.post("/signup", async function (request, response) {
  const { username, password } = request.body;
  // db.users.insertOne(data)

  // checking whether username is already exixt or not
  const userFromDB = await getUserByName(username);
  console.log(userFromDB);

  if (userFromDB) {
    response.status(400).send({ message: "Username Already exist" });
  } else if (password.length < 8) {
    response.status(400).send({ message: "Password must be 8 characters" });
  } else {
    // Creating username the password with hasihng value:
    const hashedPassword = await generateHashedPassword(password);
    const result = await createUser({
      username: username,
      password: hashedPassword,
      roleId: 1,
    });

    response.send(result);
  }
});

// Login checking details

router.post("/login", async function (request, response) {
  const { username, password } = request.body;
  // db.users.insertOne(data)

  // checking whether username is already exixt or not
  const userFromDB = await getUserByName(username);
  console.log(userFromDB);

  if (!userFromDB) {
    response.status(401).send({ message: "Invalid Credntials" });
  } else {
    const storedDBPassword = userFromDB.password;
    const isPasswordCheck = await bcrypt.compare(password, storedDBPassword);
    console.log(isPasswordCheck);

    if (isPasswordCheck) {
      const token = jwt.sign({ id: userFromDB._id }, process.env.SECRET_KEY);
      response.send({
        message: "Succesfull Login",
        token: token,
        roleId: userFromDB.roleId,
      });
    } else {
      response.status(401).send({ message: "Invalid Credentials" });
    }
  }
});
export default router;
