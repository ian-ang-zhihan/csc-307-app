import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

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

const addUser = (user) => {
  users.users_list.push(user);
  return user;
};

app.get("/users", (req, res) => {
  const name = req.query.name;
  // console.log("name = ", name);

  const job = req.query.job;
  // console.log("job = ", job);

  if (name !== undefined && job !== undefined) {
    let result = findUserByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);
  } else if (name !== undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd);
  res.send();
});

const findUserById = (id) => 
  users.users_list.find((user) => user.id === id);


app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const deleteUserById = (id) => {
  if (findUserById(id)) {
    users.users_list = users.users_list.filter((user) => user.id !== id);
    return true;
  } else {
    console.log("Error 404: User Not Found");
    return false;
  }
}

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  let result = deleteUserById(id);
  console.log("result = ", result);
  if (result === false) {
    res.status(404).send("User Not Found");
  } else {
    console.log("after delete = ", users.users_list);
    res.send();
  }
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});