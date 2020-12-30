import React, { Component, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AppbarBBS from "../components/AppbarBBS";
import BBSPostCreate from "../components/BBSPostCreate";
import bg1 from "../image/bg1.jpeg";
import BulletinBoardMain from "../components/BulletinBoardMain";

const styles = (theme) => ({
  firstDiv: {
    backgroundImage: "url(" + bg1 + ")",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    width: "auto",
    height: "100vh",
    position: "relative",
  },
});

class createPostPage extends Component {
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
    return (
      <>
        <AppbarBBS />
        <div className={classes.firstDiv}>
          <BBSPostCreate
            AppbarHeight={this.state.AppbarHeight}
            history={this.props.history}
          />
        </div>
      </>
    );
  }
}

export default withStyles(styles)(createPostPage); //withStyles 덕분에 firstDiv가 구별된다.
