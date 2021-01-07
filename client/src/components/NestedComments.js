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

class NestedComments extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            nestedComments: [],
        }
    }

    componentDidMount() {
        this.getNestedComments().then((res) => {
            this.setState({
                nestedComments: res
            });
            console.log(this.state.nestedComments)

        }).catch((err) => console.log(err))
    }

    delComment = (commentNum) => {
        const url = "/api/deleteComment/" + commentNum;
        fetch(url, {
            method: "DELETE",
        }).then((res) => {
            console.log('delcomment at nestedcomments')
            console.log(res)
            this.props.minusCommentChild(this.props.parentNum);
            this.refreshComment();
            this.props.refreshParent();
        });
    }

    refreshComment = () => {
        this.state.nestedComments = []
        this.getNestedComments()
            .then((res) => {
                this.setState({
                    nestedComments: res,
                });
            })
            .catch((err) => console.log(err));
    }

    getNestedComments = async () => {
        const response = await fetch("/api/getNestedComments/" + this.props.parentNum);
        const body = await response.json();
        return body;
    }

    render() {
        const classes = this.props;

        return (
            <LoginContext.Consumer>
                {({ isLoggedIn, userName, userImageSrc, userID }) => (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        {
                            this.state.nestedComments.map((row) => (
                                <div style={{
                                    display: "flex", alignItems: "center", marginBottom: "15px", backgroundColor: "rgba(200, 150, 150, 0.8)",
                                    borderRadius: "15px", padding: "5px", justifyContent: "space-between",
                                    height: "160px", maxWidth: "90%"
                                }}>
                                    <div style={{ flex: 7, display: "flex", alignItems: "center" }}>
                                        <img style={{ borderRadius: "50%", height: "50px", marginLeft: "10px", marginRight: "10px" }} src={row.userImage}></img>
                                        <div style={{
                                            display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: "100%"
                                        }}>
                                            <TextField
                                                disabled
                                                style={{
                                                    width: "40vw"
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
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: "10px", marginRight: "10px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center" }}>

                                        {(!isLoggedIn || (userID != row.ID)) ? (
                                            ""
                                        ) : (
                                                <Button variant="contained"
                                                    color="secondary"
                                                    onClick={(e) => { e.preventDefault(); this.delComment(row.num) }}
                                                    startIcon={<DeleteIcon />} style={{ height: "60px" }}>
                                                    삭제하기
                                                </Button>
                                            )}

                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )}
            </LoginContext.Consumer>
        );
    }
}

export default withStyles(styles)(NestedComments);
