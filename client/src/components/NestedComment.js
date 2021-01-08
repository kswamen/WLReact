import React from "react";
import Slider from "react-slick";
import { post } from "axios";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";

import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import { LoginContext } from "./LoginContext";


import "../css/carousel.css";

const styles = (theme) => ({
    multilineColor: {
        color: 'white'
    },
});

class NestedComment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }


    delComment = (commentNum) => {
        const url = "/api/deleteComment/" + commentNum;
        fetch(url, {
            method: "DELETE",
        }).then((res) => {
            this.props.minusCommentChild(this.props.parentNum);
            this.props.refreshParent();
            this.props.refreshNestedComment();
        });
    }

    render() {
        const classes = this.props;

        return (
            <LoginContext.Consumer>
                {({ isLoggedIn, userName, userImageSrc, userID }) => (
                    <div style={{
                        display: "flex", alignItems: "center", marginBottom: "15px", backgroundColor: "rgba(200, 150, 150, 0.8)",
                        borderRadius: "15px", padding: "5px", justifyContent: "space-between",
                        height: "160px", maxWidth: "90%"
                    }}>
                        <div style={{ flex: 7, display: "flex", alignItems: "center" }}>
                            <img style={{ borderRadius: "50%", height: "50px", marginLeft: "10px", marginRight: "10px" }} src={this.props.data.userImage}></img>
                            <div style={{
                                display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: "100%"
                            }}>
                                <TextField
                                    disabled
                                    style={{
                                        width: "40vw"
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
                            </div>
                        </div>
                        <div style={{ marginLeft: "10px", marginRight: "10px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center" }}>

                            {(!isLoggedIn || (userID != this.props.data.ID)) ? (
                                ""
                            ) : (
                                    <Button variant="contained"
                                        color="secondary"
                                        onClick={(e) => { e.preventDefault(); this.delComment(this.props.data.num) }}
                                        startIcon={<DeleteIcon />} style={{ height: "60px" }}>
                                        삭제하기
                                    </Button>
                                )}

                        </div>
                    </div>
                )

                }
            </LoginContext.Consumer>
        );
    }
}

export default withStyles(styles)(NestedComment);
