const express = require("express");
const app = express();

const port = process.env.PORT || 5000;
const cron = require("node-cron");

const { getNewestNews } = require("./crawlNewestNews.js");
const { getPatientsInfo } = require("./crawlPatientsInfo.js");
const APIrouter = require("./APIs.js")

server = app.listen(port, function () {
  console.log(`Listening to port ${port}`);
});

app.post("/test", (req, res) => {
  console.log('requested')
  res.send("success")
})

app.use("/api", APIrouter)

async function getNewsAsync() {
  const data = await getNewestNews();
}

async function getPatientsInfoAsync() {
  const data = await getPatientsInfo();
}

//getPatientsInfoAsync();

cron.schedule("*/5 * * * *", async () => {
  console.log("Tasks ran every one minute");
  await getPatientsInfoAsync();
  await getNewsAsync();
});



