const express = require("express");
const app = express();

const port = process.env.PORT || 5000;
const cron = require("node-cron");

const { getNewestNews } = require("./crawlNewestNews.js");
const { getPatientsInfo } = require("./crawlPatientsInfo.js");
const APIrouter = require("./APIs.js")
const IMGrouter = require("./IMGAPIs.js")
const fs = require("fs");

server = app.listen(port, function () {
  console.log(`Listening to port ${port}`);
});

app.use("/api", APIrouter)
app.use("/img", IMGrouter)

async function handleAsync() {
  try {
    await getPatientsInfo();
    const NewsData = await getNewestNews();

  } catch (error) {
    console.log(error)
  }

  //return await Promise.all([getPatientsInfo(), getNewestNews()]);
  //return await Promise.allSettled([getPatientsInfo(), getNewestNews()]);
}

//getNewsAsync();
//getPatientsInfo();


cron.schedule("0 0 */3 * * *", async () => {
  await handleAsync();
  console.log("Tasks ran every 3 hour");
});


