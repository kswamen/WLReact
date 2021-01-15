import React, { Component, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import BBSPost from "../components/BBSPost";
import Appbar from "../components/Appbar";

import "../css/BBSPost.css";
import "react-quill/dist/quill.snow.css";

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
      AppbarHeight: document.getElementById("Appbar").clientHeight,
    });
  }

  render() {
    const { classes } = this.props;
    const { params } = this.props.match;
    return (
      <>
        <Appbar />
        <BBSPost postNum={params.postNum} />
      </>
    );
  }
}

export default withStyles(styles)(postPage); //withStyles 덕분에 firstDiv가 구별된다.
