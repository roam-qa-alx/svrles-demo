import { api, data, schedule, params } from "@serverless/cloud";

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
  let userNameRandomIdentifier = +new Date();
  const userName = "user-" + userNameRandomIdentifier;
  let newUser = await data.set(userName, 1, true);
  res.send({
    users: newUser,
  });
});

data.on("created", async (event) => {
  // an item has been created
  console.log("New data has been added!");
  console.log(event.item);
});

schedule.cron("0 0 * * WED", () => {
  // This code block will run at midnight on Weds!
  console.log(
    "This was run at midnight on Wednesday. If it wasn't ... oh boy."
  );
});
