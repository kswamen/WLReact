import React, { Component, useState } from "react";
import { post } from "axios";
import { withStyles } from "@material-ui/core/styles";
import ReactQuill, { Quill } from "react-quill";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { LoginContext } from "./LoginContext";
import ImageUploader from "quill-image-uploader";
import "react-quill/dist/quill.snow.css";
import "../css/quill.css";

Quill.register("modules/imageUploader", ImageUploader);

const styles = (theme) => ({
  contentsDiv: {
    backgroundColor: "rgba(238, 230, 196, 0.7)",
    width: "70vw",
    borderRadius: "10px",
    borderColor: "#888888",
    border: 30,
    marginBottom: "10px",
  },
});

class BBSPostCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      content: "",
      thumbnail: "",
      isLoggedIn: false,
      userID: "",
      userName: "",
      userImageSrc: "",
      goodPost: false,
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.addPosts = this.addPosts.bind(this);
    this.setPosts = this.setPosts.bind(this);
  }

  modules = {
    // #3 Add "image" to the toolbar
    toolbar: [["bold", "italic", "image"]],
    // # 4 Add module and upload function
    imageUploader: {
      upload: (file) => {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("image", file);

          fetch(
            "https://api.imgbb.com/1/upload?key=d36eb6591370ae7f9089d85875e56b22",
            {
              method: "POST",
              body: formData,
            }
          )
            .then((response) => response.json())
            .then((result) => {
              resolve(result.data.url);
            })
            .catch((error) => {
              reject("Upload failed");
              console.error("Error:", error);
            });
        });
      },
    },
  };

  handleFormSubmit = () => {
    this.setPosts();
    if (this.state.title != "" && this.state.isLoggedIn != false) {
      this.state.goodPost = true;
      this.addPosts();
    } else {
    }
  };

  setPosts = () => {
    this.state.title = document.getElementById("title").value;
    this.state.content = document.getElementsByClassName(
      "ql-editor"
    )[0].innerHTML;
    if (
      document
        .getElementsByClassName("ql-editor")[0]
        .getElementsByTagName("img")[0] != null
    ) {
      this.state.thumbnail = document
        .getElementsByClassName("ql-editor")[0]
        .getElementsByTagName("img")[0].src;
    } else {
      this.state.thumbnail = "";
    }
  };

  addPosts = () => {
    const url = "/api/posts";
    const formData = new FormData();
    if (this.state.thumbnail == "") {
      this.state.thumbnail =
        "https://2.bp.blogspot.com/-muVbmju-gkA/Vir94NirTeI/AAAAAAAAT9c/VoHzHZzQmR4/s1600/placeholder-image.jpg";
    }
    formData.append("image", this.state.thumbnail);
    formData.append("title", this.state.title);
    formData.append("contents", this.state.content);
    formData.append("writer", this.state.userName);
    formData.append("ID", this.state.userID);
    formData.append("userImage", this.state.userImageSrc);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    return post(url, formData, config);
  };

  render() {
    const { classes } = this.props;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          position: "relative",
          top: this.props.AppbarHeight + 30,
        }}
      >
        <div className={classes.contentsDiv}>
          <Container style={{ display: "flex", alignItems: "center" }}>
            <TextField
              style={{ width: "100%", padding: "10px" }}
              id="title"
              label="제목을 입력하세요."
              onChange={() => {
                if (document.getElementById("title").value != "") {
                  this.setState({
                    goodPost: true,
                  });
                } else {
                  this.setState({
                    goodPost: false,
                  });
                }
              }}
            ></TextField>
          </Container>
        </div>
        <div className={classes.contentsDiv}>
          <Container
            style={{
              height: "60vh",
              display: "flex",
              justifyContent: "center",
              //alignItems: "center",
            }}
          >
            <ReactQuill id="content" modules={this.modules}></ReactQuill>
          </Container>
        </div>
        <div className={classes.contentsDiv}>
          <Container
            style={{
              display: "flex",
              height: "10vh",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Button
              href="/BBS"
              style={{ height: "70%", marginRight: "15px" }}
              variant="outlined"
              color="secondary"
            >
              이전 페이지로 이동
            </Button>
            <Button
              style={{ height: "70%" }}
              variant="outlined"
              color="primary"
              onClick={this.handleFormSubmit}
              href={this.state.goodPost ? "/BBS" : ""}
            >
              게시글 올리기
            </Button>
          </Container>
          <LoginContext.Consumer>
            {({ isLoggedIn, userName, userImageSrc, userID }) => (
              <div style={{ display: "none" }}>
                {
                  ((this.state.isLoggedIn = isLoggedIn),
                  (this.state.userName = userName),
                  (this.state.userID = userID),
                  (this.state.userImageSrc = userImageSrc))
                }
              </div>
            )}
          </LoginContext.Consumer>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(BBSPostCreate); //withStyles 덕분에 firstDiv가 구별된다.
