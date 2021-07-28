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

app.post("/getImgURL", upload.single('image'), (req, res) => {
    let url = '/img/getImg/' + req.file.filename;
    res.json({
        url: url
    });
})
app.get("/getImg/:ImgURL", (req, res) => {
    res.sendFile("./upload/" + req.params.ImgURL, { root: '.' })
})

module.exports = app;