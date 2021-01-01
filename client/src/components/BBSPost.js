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
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import "../css/BBSPost.css";

const styles = (theme) => ({
  contentsDiv: {
    backgroundColor: "rgba(238, 230, 196, 0.7)",
    width: "70vw",
    height: "100%",
    borderRadius: "10px",
    borderColor: "#888888",
    border: 30,
    marginBottom: "10px",
  },
  resize: {
    fontSize: 24,
  },
  multilineColor: {
    color: 'black'
  },
});

class postPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AppbarHeight: 0,
      post: "",
      comment: [],
    };

    this.addComment = this.addComment.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.getComments = this.getComments.bind(this);
    this.delPost = this.delPost.bind(this);
    this.refreshComment = this.refreshComment.bind(this);
  }

  componentDidMount() {
    this.setState({
      AppbarHeight: document.getElementById("Appbar-bbs").clientHeight,
    });
    this.getPosts()
      .then((res) => {
        this.setState({
          post: res[0],
        });
      })
      .catch((err) => console.log(err));
    this.getComments()
      .then((res) => {
        this.setState({
          comment: res,
        });
      })
      .catch((err) => console.log(err));
  }

  getPosts = async () => {
    const response = await fetch("/api/getPost/" + this.props.postNum);
    const body = await response.json();
    return body;
  };

  getComments = async () => {
    const response = await fetch("/api/getComment/" + this.props.postNum);
    const body = await response.json();
    return body;
  }

  delPost = () => {
    const url = "/api/deletePost/" + this.props.postNum;
    fetch(url, {
      method: "DELETE",
    });
  };

  addComment = () => {
    const url = "/api/addComment/";
    const formData = new FormData();

    formData.append("writer", this.state.post.writer)
    console.log(formData)
    formData.append("ID", this.state.post.ID)
    formData.append("userImage", this.state.post.userImage)
    formData.append("postNum", this.state.post.num)
    formData.append("content", document.getElementById("commentContent").value);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    post(url, formData, config).then(() => {
      this.refreshComment()
    });
  };

  refreshComment = () => {
    this.state.comment = []
    this.getComments()
      .then((res) => {
        this.setState({
          comment: res,
        });
      })
      .catch((err) => console.log(err));
  }

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


        <LoginContext.Consumer>
          {({ isLoggedIn, userName, userImageSrc, userID }) => (
            <>
              {!isLoggedIn ? (
                ""
              ) : (
                  <div className={classes.contentsDiv}>
                    <div style={{
                      marginLeft: "15px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                      paddingTop: '10px',
                      paddingBottom: '10px',
                      height: '100px',
                    }}>
                      <img
                        style={{
                          width: "6%",
                          borderRadius: "50%",
                          marginRight: "15px"
                        }}
                        src={this.state.post.userImage}
                      />
                      <TextField
                        style={{
                          width: "55vw"
                        }}
                        id="commentContent"
                        label="Multiline"
                        multiline
                        rows={3}
                        variant="filled"
                        label="여기에 댓글을 입력하세요."
                      />
                      <div
                        style={{
                          display: "flex",
                          flex: 1,
                          height: "100px",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          marginRight: "15px"
                        }}
                      >
                        <Button
                          variant="outlined"
                          color="default"
                          style={{
                            padding: '15px',
                            height: '70%'
                          }}
                          onClick={this.addComment}
                        >
                          댓글 쓰기
                        </Button>
                      </div>
                    </div>
                  </div >
                )}
            </>
          )}
        </LoginContext.Consumer>


        <div className={classes.contentsDiv}>
          <Container
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "15px",
              marginBottom: "15px",
              justifyContent: "center",
            }}>
            <div
              style={{
                marginLeft: "15px",
                marginRight: "15px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                maxWidth: "85vw",
                width: "100%",
                backgroundColor: "rgba(200, 200, 200, 0.8)",
                borderRadius: "15px",
                padding: "30px",
                marginTop: "15px",
                marginBottom: "15px",
              }}
            >
              {this.state.comment.map((row) => (
                <div style={{
                  display: "flex", alignItems: "center", marginBottom: "15px", backgroundColor: "rgba(150, 150, 150, 0.8)",
                  borderRadius: "15px", padding: "5px", justifyContent: "space-between", height: "120px",
                }}>
                  <div style={{ flex: 7, display: "flex", alignItems: "center" }}>
                    <img style={{ borderRadius: "50%", height: "50px", marginLeft: "10px", marginRight: "10px" }} src={row.userImage}></img>
                    <TextField
                      disabled
                      style={{
                        width: "50vw"
                      }}
                      id="outlined-multiline-static"
                      label={row.writer}
                      multiline
                      rows={4}
                      defaultValue={row.content}
                      variant="outlined"
                      InputProps={{
                        classes: {
                          input: classes.multilineColor
                        }
                      }}
                    />
                  </div>
                  <div style={{ marginLeft: "10px", marginRight: "10px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center" }}>
                    <Button variant="contained"
                      color="primary"
                      startIcon={<CloudUploadIcon />} style={{ height: "40" }}>
                      댓글 달기
                    </Button>
                    <LoginContext.Consumer>
                      {({ isLoggedIn, userID }) => (
                        <>
                          {(!isLoggedIn || (userID != row.ID)) ? (
                            ""
                          ) : (
                              <Button variant="contained"
                                color="secondary"
                                startIcon={<DeleteIcon />} style={{ height: "40" }}>
                                삭제하기
                                
                              </Button>
                            )}
                        </>
                      )
                      }
                    </LoginContext.Consumer>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </div>

      </div >
    );
  }
}

export default withStyles(styles)(postPage); //withStyles 덕분에 firstDiv가 구별된다.
