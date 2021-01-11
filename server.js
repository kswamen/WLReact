const express = require("express");
const app = express();

const port = process.env.PORT || 5000;
const cron = require("node-cron");

const { getNewestNews } = require("./crawlNewestNews.js");
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

cron.schedule("*/10 * * * *", async () => {
  console.log("running a task every one minutes");
  await getNewsAsync();
});



