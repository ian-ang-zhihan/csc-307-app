import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Hello World!");
});


app.get("/users", (req, res) => {
  const name = req.query.name;
  // console.log("name = ", name);

  const job = req.query.job;
  // console.log("job = ", job);

  userService
    .getUsers(name, job)
    .then((users) => {
      res.send({ users_list: users });
    })
    .catch((error) => {
      console.log("Error fetching users: ", error);
      res.status(500).send("Internal Server Error");
    })
});


app.post("/users", (req, res) => {
  const userToAdd = req.body;

  userService
    .addUser(userToAdd)
    .then((newUser) => {
      res.status(201).send(newUser);
    })
    .catch((error) => {
      console.log("Error adding user: ", error);
      res.status(500).send("Internal Server Error");
    })
});


app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  userService
    .findUserById(id)
    .then((user) => {
      if (user === null) {
        res.send(404).send("Resouce not found");
      }
      else {
        res.send(user);
      }
    })
    .catch((error) => {
      console.log("Error finding user by ID: ", error);
      res.status(500).send("Internal Server Error");
    })
  });
  
  app.delete("/users/:id", (req, res) => {
    // console.log("req = ", req);
    // console.log("res = ", res);
    
    const id = req.params.id;
    // console.log("id = ", id);
    
    userService
      .deleteUserById(id)
      .then((result) => {
        if (result === null) {
          res.status(404).send("User Not Found");
        }
        else {
          res.status(204).send();
        } 
      })
      .catch((error) => {
        console.log("Error deleting user by ID: ", error);
        res.status(500).send("Internal Server Error");
      })
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});