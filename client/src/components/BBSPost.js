import React, { Component, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { post } from "axios";
import NestedCommentsButton from "./NestedCommentsButton.js"
import NestedComments from "./NestedComments.js"
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Moment from "react-moment";


import "../css/BBSPost.css";

const styles = (theme) => ({
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
      nestedComment: [],

      temp: 12312412412124,

      textValue: "",
      commentDlgOpen: false,
      targetComment: -1,
    };

    this.addComment = this.addComment.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.getComments = this.getComments.bind(this);
    this.delPost = this.delPost.bind(this);
    this.refreshComment = this.refreshComment.bind(this);
    this.delComment = this.delComment.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  componentDidMount() {
    this.setState({
      AppbarHeight: document.getElementById("Appbar").clientHeight,
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

    const new_body = body.map((row) => {
      return { ...row, isopen: false }
    })
    return new_body;
  }

  delPost = () => {
    const url = "/api/deletePost/" + this.props.postNum;
    fetch(url, {
      method: "DELETE",
    });
  };

  delComment = (commentNum) => {
    const url = "/api/deleteComment/" + commentNum;
    fetch(url, {
      method: "DELETE",
    }).then(() => {
      console.log('delcomment at bbsPost')
      this.refreshComment()
    });
  }

  handleOpen = (commentNum) => {
    this.setState({
      commentDlgOpen: true,
      targetComment: commentNum,
    });
  }

  handleClose = () => {
    this.setState({
      commentDlgOpen: false,
    });
  }

  addComment = (parentNum) => {
    const url = "/api/addComment/";
    const formData = new FormData();

    formData.append("writer", this.state.post.writer)
    formData.append("ID", this.state.post.ID)
    formData.append("userImage", this.state.post.userImage)
    formData.append("postNum", this.state.post.num)
    formData.append("content", this.state.textValue);

    if (parentNum != undefined) {
      formData.append("parentNum", parentNum);
    }

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    post(url, formData, config).then(() => {
      this.refreshComment()
      document.getElementById("commentContent").value = ''
    });
  };

  minusCommentChild = async (parentNum) => {
    console.log('minuscommentchild')

    const response = await fetch("/api/minusCommentChild/" + parentNum);
    const body = await response.json();
    return body;
  }

  setTextValue = (event) => {
    this.setState({ textValue: event.target.value });
  }

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
        className='frameDiv'
        style={{
          top: this.state.AppbarHeight + 30,
        }}
      >
        <LoginContext.Consumer>
          {({ isLoggedIn, userName, userImageSrc, userID }) => (
            <>
              <div className="contentsDiv">
                <Container
                  className='postContainer'
                >
                  <Paper
                    className="titlePaper"
                    style={{
                      backgroundColor: 'transparent'
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
              <div className="contentsDiv">
                <div
                  className='postDiv'
                  dangerouslySetInnerHTML={{ __html: this.state.post.contents }}
                ></div>
              </div>
              <div className="contentsDiv">
                <Container
                  style={{
                    display: "flex",
                    height: "10vh",
                  }}
                >
                  <div
                    className='infoDiv'
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
                  </div>
                </Container>
              </div>

              {!isLoggedIn ? (
                ""
              ) : (
                  <div className="contentsDiv">
                    <div className='commentInputDiv'>
                      <img
                        style={{
                          width: "6%",
                          borderRadius: "50%",
                          marginRight: "15px"
                        }}
                        src={this.state.post.userImage}
                      />
                      <TextField
                        onChange={this.setTextValue}
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
                        className='commentInputButtonDiv'
                      >
                        <Button
                          variant="outlined"
                          color="default"
                          style={{
                            padding: '15px',
                            height: '70%'
                          }}
                          onClick={(e) => { e.preventDefault(); this.addComment() }}
                        >
                          댓글 쓰기
                        </Button>
                      </div>
                    </div>
                  </div >
                )}

              <div className="contentsDiv">
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
                      <div>
                        <div style={{
                          display: "flex", alignItems: "center", marginBottom: "15px", backgroundColor: "rgba(150, 150, 150, 0.8)",
                          borderRadius: "15px", padding: "5px", justifyContent: "space-between", height: "160px",
                        }}>
                          <div style={{ flex: 7, display: "flex", alignItems: "center" }}>
                            <img style={{ borderRadius: "50%", height: "50px", marginLeft: "10px", marginRight: "10px" }} src={row.userImage}></img>
                            <div style={{
                              display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: "100%"
                            }}>
                              <TextField
                                disabled
                                style={{
                                  width: "47vw"
                                }}
                                id="outlined-multiline-static"
                                label={"Written by " + row.writer + " on " + row.date}
                                multiline
                                rows={4}
                                value={row.content}
                                variant="outlined"
                                InputProps={{
                                  classes: {
                                    input: classes.multilineColor
                                  },
                                }}
                              />
                              {row.childCount == 0 ? <> </> :
                                <>
                                  <NestedCommentsButton
                                    childCount={row.childCount}
                                    parentComment={row.num}
                                    isopen={row.isopen}
                                    handleClick={() => {
                                      let target = []
                                      let temp = []
                                      let i = 0
                                      this.state.comment.map((a, index) => {
                                        if (a.num == row.num) {
                                          target = a
                                          i = index
                                        }
                                        else temp.push(a)
                                      })
                                      target.isopen = !row.isopen
                                      temp.splice(i, 0, target)
                                      this.setState({
                                        comment: temp
                                      })
                                    }} />
                                </>
                              }
                            </div>
                          </div>
                          {(!isLoggedIn || (userID != row.ID)) ? (
                            ""
                          ) : (
                              <div style={{ marginLeft: "10px", marginRight: "10px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center" }}>

                                <Button variant="contained"
                                  color="primary"
                                  onClick={() => { this.handleOpen(row.num) }}
                                  startIcon={<CloudUploadIcon />} style={{ height: "60px" }}>
                                  댓글 달기
                                </Button>

                                <Dialog id='commentDlg' onClose={() => { this.handleClose(); }}
                                  open={this.state.commentDlgOpen} fullWidth={true} maxWidth='md'>
                                  <DialogTitle onClose={() => { this.handleClose() }}>댓글 달기</DialogTitle>
                                  <DialogContent>
                                    <TextField
                                      onChange={this.setTextValue}
                                      style={{
                                        width: "100%"
                                      }}
                                      id="nestedCommentContent"
                                      label="Multiline"
                                      multiline
                                      rows={3}
                                      variant="filled"
                                      label="여기에 댓글을 입력하세요."
                                    />
                                  </DialogContent>
                                  <DialogActions>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={(e) => {
                                        e.preventDefault(); this.addComment(this.state.targetComment); this.handleClose();
                                      }}
                                    >
                                      댓글 추가
                              </Button>
                                    <Button
                                      variant="outlined"
                                      color="primary"
                                      onClick={() => { this.handleClose() }}
                                    >
                                      닫기
                              </Button>
                                  </DialogActions>
                                </Dialog>


                                <Button variant="contained"
                                  color="secondary"
                                  onClick={(e) => { e.preventDefault(); this.delComment(row.num) }}
                                  startIcon={<DeleteIcon />} style={{ height: "60px" }}>
                                  삭제하기
                                </Button>


                              </div>
                            )}
                        </div>
                        {row.isopen == false ? <> </> :
                          <NestedComments parentNum={row.num} minusCommentChild={this.minusCommentChild}
                            refreshParent={this.refreshComment} />
                        }
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
            </>
          )}
        </LoginContext.Consumer>
      </div >
    );
  }
}

export default withStyles(styles)(postPage); //withStyles 덕분에 firstDiv가 구별된다.
