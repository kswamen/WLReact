import React, { Component, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { post } from "axios";
import ReactQuill from "react-quill";
import BBSPost from "../components/BBSPost";
import "react-quill/dist/quill.snow.css";
import AppbarBBS from "../components/AppbarBBS";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import bg1 from "../image/bg1.jpeg";
import Button from "@material-ui/core/Button";

import "../css/BBSPost.css";

const styles = (theme) => ({});

class postPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AppbarHeight: 0,
    };
  }

  componentDidMount() {
    this.setState({
      AppbarHeight: document.getElementById("Appbar-bbs").clientHeight,
    });
  }

  render() {
    const { classes } = this.props;
    const { params } = this.props.match;
    return (
      <>
        <AppbarBBS />
        <BBSPost postNum={params.postNum} />
      </>
    );
  }
}

export default withStyles(styles)(postPage); //withStyles 덕분에 firstDiv가 구별된다.
