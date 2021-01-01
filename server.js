const express = require("express");
const fs = require("fs");
const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);
const mysql = require("mysql");
const multer = require("multer");
const upload = multer({ dest: "./upload" });

const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 5000;
const cron = require("node-cron");
const newsJSON = fs.readFileSync("./newestNewsData.json");

const { getNewestNews } = require("./crawlNewestNews.js");
const { writer } = require("repl");

const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database,
});
connection.connect();

app.get("/api/customers", (req, res) => {
  connection.query(
    "Select * From posts where isDeleted = 0 order by date desc",
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.get("/api/getPost/:postNum", (req, res) => {
  let sql = "Select * from posts where num = ?";
  let params = [req.params.postNum];

  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
  });
});

app.get("/api/getComment/:postNum", (req, res) => {
  let sql = "Select * from comments where postNum = ?";
  let params = [req.params.postNum];

  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
  })
})

app.delete("/api/deletePost/:postNum", (req, res) => {
  let sql = "update posts set isDeleted = 1 where num = ?";
  let params = [req.params.postNum];
  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
  });
});

app.use("/image", express.static("./upload"));

app.post("/api/addComment", upload.single("image"), (req, res) => {
  let sql = "insert into comments(ID, userImage, postNum, content, writer) values (?, ?, ?, ?, ?)";

  let userImage = req.body.userImage;
  let ID = req.body.ID;
  let postNum = req.body.postNum;
  let content = req.body.content;
  let writer = req.body.writer;
  let params = [ID, userImage, postNum, content, writer];

  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
  });
});

app.post("/api/posts", upload.single("image"), (req, res) => {
  let sql =
    "insert into posts(image, title, contents, writer, ID, userImage) values (?, ?, ?, ?, ?, ?)";
  let image = req.body.image;
  let title = req.body.title;
  let contents = req.body.contents;
  let writer = req.body.writer;
  let ID = req.body.ID;
  let userImage = req.body.userImage;
  let params = [image, title, contents, writer, ID, userImage];

  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
  });
});

async function getNewsAsync() {
  const data = await getNewestNews();
}

cron.schedule("*/10 * * * *", async () => {
  console.log("running a task every one minutes");
  await getNewsAsync();
});

app.get("/api/news", async (req, res) => {
  res.send(newsJSON);
});

server = app.listen(port, function () {
  console.log(`Listening to port ${port}`);
});
