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

/*
const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};
*/

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Step 4
const findUserByName = (name) => {
  return users.users_list.filter(
    (user) => user.name === name
  );
};

const findUserByNameAndJob = (name, job) => {
  let result = users.users_list.filter((user) => {
    return ((user.name === name) && (user.job === job))
  });
  return result;
};

function generateRandomID() {
  return (Math.random().toString());
} 
const addUser = (user) => {
  users.users_list.push(user);
  return user;
};

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

const findUserById = (id) => 
  users.users_list.find((user) => user.id === id);


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

const deleteUserById = (id) => {
  // console.log("deleteUserByID id = ", id);
  // console.log("deleteUserByID users.users_list= ", users.users_list);
  if (findUserById(id)) {
    users.users_list = users.users_list.filter((user) => user.id !== id);
    return true;
  } else {
    console.log("Error 404: User Not Found");
    return false;
  }
}

app.delete("/users/:id", (req, res) => {
  // console.log("req = ", req);
  // console.log("res = ", res);

  const id = req.params.id;
  // console.log("id = ", id);

  let result = deleteUserById(id);
  // console.log("result = ", result);

  if (result === false) {
    res.status(404).send("User Not Found");
  } else {
    // console.log("after delete = ", users.users_list);
    res.status(204).send();
  }
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});