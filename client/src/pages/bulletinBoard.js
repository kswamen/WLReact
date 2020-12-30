import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import NewsCarousel from "../components/NewsCarousel";
import bg1 from "../image/bg1.jpeg";
import AppbarBBS from "../components/AppbarBBS";
import BulletinBoardMain from "../components/BulletinBoardMain";

const styles = (theme) => ({
  firstDiv: {
    backgroundImage: "url(" + bg1 + ")",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    width: "auto",
    height: "100vh",
  },
});

class bulletinBoard extends Component {
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
        <div id="section1" className={classes.firstDiv}>
          <BulletinBoardMain AppbarHeight={this.state.AppbarHeight} />
        </div>
      </>
    );
  }
}

export default withStyles(styles)(bulletinBoard); //withStyles 덕분에 firstDiv가 구별된다.
