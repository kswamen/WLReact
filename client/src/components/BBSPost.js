import React, { Component, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { post } from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AppbarBBS from "../components/AppbarBBS";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import bg1 from "../image/bg1.jpeg";
import titleBg from "../image/title.png";
import Button from "@material-ui/core/Button";
import { LoginContext } from "./LoginContext";

import "../css/BBSPost.css";

const styles = (theme) => ({
  contentsDiv: {
    backgroundColor: "rgba(238, 230, 196, 0.7)",
    width: "70vw",
    borderRadius: "10px",
    borderColor: "#888888",
    border: 30,
    marginBottom: "10px",
  },
  resize: {
    fontSize: 24,
  },
});

class postPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AppbarHeight: 0,
      post: "",
    };
  }

  componentDidMount() {
    this.setState({
      AppbarHeight: document.getElementById("Appbar-bbs").clientHeight,
    });
    this.getPosts()
      .then((res) => {
        console.log(res[0]);
        this.setState({
          post: res[0],
        });
      })
      .catch((err) => console.log(err));
  }

  getPosts = async () => {
    const response = await fetch("/api/getPost/" + this.props.postNum);
    const body = await response.json();
    return body;
  };

  delPost = () => {
    const url = "/api/deletePost/" + this.props.postNum;
    fetch(url, {
      method: "DELETE",
    });
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
          top: this.state.AppbarHeight + 30,
        }}
      >
        <div className={classes.contentsDiv}>
          <Container
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "15px",
              marginBottom: "15px",
              justifyContent: "center",
            }}
          >
            <Paper
              style={{
                backgroundImage: "url(" + titleBg + ")",
                backgroundColor: "transparent",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                style={{ color: "#c0c0c0" }}
              >
                {this.state.post.title}
              </Typography>
            </Paper>
          </Container>
        </div>
        <div className={classes.contentsDiv}>
          <div
            style={{
              marginLeft: "30px",
              marginRight: "30px",
              position: "relative",
              display: "block",
              maxWidth: "85vw",
              backgroundColor: "rgba(200, 200, 200, 0.8)",
              borderRadius: "15px",
              padding: "30px",
              marginTop: "30px",
              marginBottom: "30px",
            }}
            dangerouslySetInnerHTML={{ __html: this.state.post.contents }}
          ></div>
        </div>
        <div className={classes.contentsDiv}>
          <Container
            style={{
              display: "flex",
              height: "10vh",
            }}
          >
            <div
              style={{
                display: "flex",
                flex: 1,
                height: "100%",
                alignItems: "center",
              }}
            >
              <img
                style={{
                  height: "55%",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
                src={this.state.post.userImage}
              />
              <Typography variant="h5">{this.state.post.writer}</Typography>
              <Typography variant="h6">
                &nbsp; 님이 작성한 게시글입니다.
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                flex: 1,
                height: "100%",
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
              <LoginContext.Consumer>
                {({ userID }) => (
                  <>
                    {this.state.post.ID == userID ? (
                      <Button
                        style={{ height: "70%" }}
                        variant="outlined"
                        color="primary"
                        onClick={this.delPost}
                        href="/BBS"
                      >
                        게시글 삭제하기
                      </Button>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </LoginContext.Consumer>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(postPage); //withStyles 덕분에 firstDiv가 구별된다.
