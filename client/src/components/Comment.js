import React from "react";
import Slider from "react-slick";
import { post } from "axios";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import NestedComment from "./NestedComment.js";
import NestedCommentsButton from "./NestedCommentsButton.js";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import { LoginContext } from "./LoginContext";


import "../css/carousel.css";

const styles = (theme) => ({
    multilineColor: {
        color: 'white'
    },
});

class Comment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            nestedComments: [],
            isopen: false,
            textValue: '',
        }
    }

    componentDidMount() {
        this.getNestedComments().then((res) => {
            this.setState({
                nestedComments: res
            });

        }).catch((err) => console.log(err))
    }

    delComment = (commentNum) => {
        const url = "/api/deleteComment/" + commentNum;
        fetch(url, {
            method: "DELETE",
        }).then((res) => {
            this.props.minusCommentChild(this.props.parentNum);
            this.props.refreshComment();
            this.props.refreshParent();
        });
    }

    setTextValue = (event) => {
        this.setState({ textValue: event.target.value });
    }

    getComments = async () => {
        const response = await fetch("/api/getComment/" + this.props.postNum);
        const body = await response.json();

        const new_body = body.map((row) => {
            return { ...row, isopen: false }
        })
        return new_body;
    }

    minusCommentChild = async (parentNum) => {

        const response = await fetch("/api/minusCommentChild/" + parentNum);
        const body = await response.json();
        return body;
    }

    addComment = (parentNum) => {
        let context = this.context;
        const url = "/api/addComment/";
        const formData = new FormData();

        formData.append("writer", context.userName)
        formData.append("ID", context.userID)
        formData.append("userImage", context.userImageSrc)
        formData.append("postNum", this.props.post.num)
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
            this.props.refreshComment();
            this.refreshNestedComment();
            document.getElementById("commentContent").value = '';
        });
    };

    refreshNestedComment = () => {
        this.state.nestedComments = []
        this.getNestedComments()
            .then((res) => {
                this.setState({
                    nestedComments: res,
                });
            })
            .catch((err) => console.log(err));
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

    delComment = (commentNum) => {
        const url = "/api/deleteComment/" + commentNum;
        fetch(url, {
            method: "DELETE",
        }).then(() => {
            this.props.refreshComment()
        });
    }

    getNestedComments = async () => {
        const response = await fetch("/api/getNestedComments/" + this.props.data.num);
        const body = await response.json();
        return body;
    }

    render() {
        const classes = this.props;

        return (
            <LoginContext.Consumer>
                {({ isLoggedIn, userName, userImageSrc, userID }) => (
                    <>
                        <div>
                            <div style={{
                                display: "flex", alignItems: "center", marginBottom: "15px", backgroundColor: "rgba(150, 150, 150, 0.8)",
                                borderRadius: "15px", padding: "5px", justifyContent: "space-between", height: "160px",
                            }}>
                                <div style={{ flex: 7, display: "flex", alignItems: "center" }}>
                                    <img style={{ borderRadius: "50%", height: "50px", marginLeft: "10px", marginRight: "10px" }} src={this.props.data.userImage}></img>
                                    <div style={{
                                        display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: "100%"
                                    }}>
                                        <TextField
                                            disabled
                                            style={{
                                                width: "47vw"
                                            }}
                                            id="outlined-multiline-static"
                                            label={"Written by " + this.props.data.writer + " on " + this.props.data.date}
                                            multiline
                                            rows={4}
                                            value={this.props.data.content}
                                            variant="outlined"
                                            InputProps={{
                                                classes: {
                                                    input: classes.multilineColor
                                                },
                                            }}
                                        />
                                        {this.props.data.childCount == 0 ? <> </> :
                                            <>
                                                <NestedCommentsButton
                                                    childCount={this.props.data.childCount}
                                                    parentComment={this.props.data.num}
                                                    isopen={this.state.isopen}
                                                    handleClick={() => {
                                                        this.setState({
                                                            isopen: !this.state.isopen
                                                        })
                                                    }} />
                                            </>
                                        }
                                    </div>
                                </div>
                                <div style={{ marginLeft: "10px", marginRight: "10px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center" }}>

                                    {!isLoggedIn ? (
                                        ""
                                    ) : (<>

                                        <Button variant="contained"
                                            color="primary"
                                            onClick={() => { this.handleOpen(this.props.data.num) }}
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
                                                        e.preventDefault(); this.addComment(this.props.data.num); this.handleClose();
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

                                        {userID != this.props.data.ID ? <> </> :
                                            <>
                                                <Button variant="contained"
                                                    color="secondary"
                                                    onClick={(e) => { e.preventDefault(); this.delComment(this.props.data.num) }}
                                                    startIcon={<DeleteIcon />} style={{ height: "60px" }}>
                                                    삭제하기
                                        </Button>
                                            </>
                                        }
                                    </>
                                        )}
                                </div>
                            </div>
                            {this.state.isopen == false ? <> </> :
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    {
                                        this.state.nestedComments.map(row => (
                                            <NestedComment parentNum={this.props.data.num} minusCommentChild={this.minusCommentChild}
                                                refreshParent={this.props.refreshComment} data={row} refreshNestedComment={this.refreshNestedComment} />
                                        ))
                                    }
                                </div>

                            }
                        </div>
                    </>
                )}
            </LoginContext.Consumer>
        );
    }
}

Comment.contextType = LoginContext;
export default withStyles(styles)(Comment);
