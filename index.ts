import { api, data, schedule, params } from "@serverless/cloud"
import axios from "axios"
import * as dotenv from "dotenv";
dotenv.config()

// Create GET route and return users
api.get("/users", async (req, res) => {
  // Get users from Serverless Data
  let result = await data.get("user:*", true);
  // Return the results
  res.send({
    users: result.items,
  });
});

// Redirect to users endpoint
api.get("/*", (req, res) => {
  res.redirect("/users");
});

// Create POST route to create user
api.post("/users", async (req, res) => {
  let newUser: Object;
  newUser = await data.set(generateUserNameWithTimestamp(), 1, true);
  res.send({
    users: newUser,
  });
});

function generateUserNameWithTimestamp() {
  let userNameRandomIdentifier: number;
  let combinedUserName: string;

  userNameRandomIdentifier = +new Date();
  combinedUserName = "user-" + userNameRandomIdentifier;
  console.log(`username generated is: ${combinedUserName}`)
  return combinedUserName;
}


data.on("created", async (event) => {
  // an item has been created
  console.log("New data has been added!");
  console.log(event.item);
});

schedule.every("1 minute", () => {
  console.log("I run every 1 minute");
  let config = {
    method: 'post',
    url: process.env.SERVERLESS_URL,
    headers: { }
  };
  axios(config)
  .then((response) => {
  console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
  console.log(error);
  });
  console.log("test!");
})
