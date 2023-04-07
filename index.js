// const express = require("express"); // 3rd party package installed
import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import cors from "cors";
import { auth } from "./middleware/auth.js";
import { ObjectId } from "mongodb";
dotenv.config();

const app = express(); // called imported package express we will get app

const PORT = process.env.PORT; // Autp assign PORT

// Connection

// const MONGO_URL = "mongodb://127.0.0.1";
const MONGO_URL = process.env.MONGO_URL;

const client = new MongoClient(MONGO_URL); // dial
await client.connect(); // calling
console.log("Mongo is Connected");

// we should use middleware to intimate our data is Json

// MiddleWare is express.json() => convert json to javascript.It is an inbuilt middleware
app.use(express.json());
app.use(cors());

app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩✨✨✨✨✨✨✨HELLO WORLD  !!!");
});

// link http://localhost:4000

app.use("/user", userRouter);

// creating a server for mobiles
// get data  http://localhost:4000/mobiles

// GET mobiles method // GET mobile from atlas
app.get("/mobiles", auth, async function (request, response) {
  //cursor
  const mobiles = await client
    .db("b40wd")
    .collection("mobiles")
    .find({})
    .toArray();
  response.send(mobiles);
});

// upload mobiles array into atlas
// write POST api
app.post("/mobiles", async function (request, response) {
  const data = request.body;
  console.log(data);
  // db.mobiles.insertMany(data)
  const result = await client
    .db("b40wd")
    .collection("mobiles")
    .insertMany(data);
  response.send(result);
});

const ROLE_ID = {
  ADMIN: "0",
  USER: "1",
};

// DELETE by mobile ID
app.delete("/mobiles/:id", auth, async function (request, response) {
  const { id } = request.params;
  // db.mobiles.deleteOne({_id:object _id })
  const { roleId } = request;
  if (roleId == ROLE_ID.ADMIN) {
    const result = await client
      .db("b40wd")
      .collection("mobiles")
      .deleteOne({ _id: ObjectId(id) });

    console.log(result);
    result.deletedCount > 0
      ? response.send({ message: "Mobiles deleted Successfully" })
      : response.status(404).send({ message: "mobile not found" });
  } else {
    response.status(404).send({ messgae: "Unauthorized" });
  }
});

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));

export { client };
