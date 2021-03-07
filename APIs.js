const express = require('express');
const multer = require("multer");
const upload = multer({ dest: "./upload" });
const connection = require('./ConnectDB.js')
const fs = require("fs");

const bodyParser = require("body-parser");
const { url } = require('inspector');
const app = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/image", express.static("./upload"));

const newsJSON = fs.readFileSync("./newestNewsData.json");
const patientsJSON = fs.readFileSync("./patientsInfo.json");

app.get("/news", async (req, res) => {
    res.send(newsJSON);
});

app.get("/patientsInfo", async (req, res) => {
    res.send(patientsJSON);
})

app.get("/customers", (req, res) => {
    connection.query(
        "Select * From posts where isDeleted = 0 order by date desc",
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});

app.get("/getPost/:postNum", (req, res) => {
    let sql = "Select * from posts where num = ?";
    let params = [req.params.postNum];

    connection.query(sql, params, (err, rows, fields) => {
        res.send(rows);
    });
});

app.get("/getComment/:postNum", (req, res) => {
    let sql = "Select * from comments where postNum = ? and isDeleted = ? and parentNum is NULL";
    let params = [req.params.postNum, 0];

    connection.query(sql, params, (err, rows, fields) => {
        res.send(rows);
    })
})

app.get("/minusCommentChild/:parentNum", (req, res) => {
    let sql = "update comments set childCount = childCount - 1 where num = ?"
    let params = [req.params.parentNum]

    connection.query(sql, params, (err, rows, fields) => {
        res.send(rows);
    })
})

app.get("/getNestedComments/:parentNum", (req, res) => {
    let sql = "Select * from comments where parentNum = ? and isDeleted = ?";
    let params = [req.params.parentNum, 0];

    connection.query(sql, params, (err, rows, fields) => {
        res.send(rows);
    })
})

app.delete("/deletePost/:postNum", (req, res) => {
    let sql = "update posts set isDeleted = 1 where num = ?";
    let params = [req.params.postNum];
    connection.query(sql, params, (err, rows, fields) => {
        res.send(rows);
    });
});

app.delete("/deleteComment/:commentNum", (req, res) => {
    let sql = "update comments set isDeleted = 1 where num = ?";
    let params = [req.params.commentNum];
    connection.query(sql, params, (err, rows, fields) => {
        res.send(rows);
    })
});

app.post("/addComment", upload.single('userImage'), (req, res) => {
    let sql = "insert into comments(ID, userImage, postNum, content, writer, parentNum) values (?, ?, ?, ?, ?, ?)";

    let userImage = req.body.userImage;
    let ID = req.body.ID;
    let postNum = req.body.postNum;
    let content = req.body.content;
    let writer = req.body.writer;
    let parentNum = null;

    if (req.body.parentNum != undefined) {
        parentNum = req.body.parentNum
        let sql = "update comments set childCount = childCount + 1 where num = ?"
        let params = [parentNum]
        connection.query(sql, params)
    }

    let params = [ID, userImage, postNum, content, writer, parentNum];

    connection.query(sql, params, (err, rows, fields) => {
        res.send(rows);
    });
});

app.post("/posts", upload.single("image"), (req, res) => {
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



module.exports = app;