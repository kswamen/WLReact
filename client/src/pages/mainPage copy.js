import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import NewsCarousel from "../components/NewsCarousel";
import bg1 from "../image/bg1.jpeg";
import bg2 from "../image/bg2.jpg";
import bg3 from "../image/bg3.jpg";
import Appbar from "../components/Appbar";
import logo from "../image/mask.png";

import LoadingScreen from "react-loading-screen";

import { LoginContext } from "../components/LoginContext";

const styles = (theme) => ({
  firstDiv: {
    backgroundImage: "url(" + bg1 + ")",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    width: "auto",
    height: "100vh",
  },
  secondDiv: {
    backgroundImage: "url(" + bg2 + ")",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    width: "auto",
    height: "100vh",
  },
  thirdDiv: {
    backgroundImage: "url(" + bg3 + ")",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    width: "auto",
    height: "100vh",
  },
  fourthDiv: {
    backgroundImage: "url(" + bg1 + ")",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    width: "auto",
    height: "100vh",
  },
});

class mainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    let that = this;
    setTimeout(function () {
      that.setState({ isLoading: false });
    }, 2000);
  }

  render() {
    const { classes } = this.props;
    return (
      <>
        <LoadingScreen
          loading={this.state.isLoading}
          bgColor="#f1f1f1"
          spinnerColor="#9ee5f8"
          textColor="#676767"
          logoSrc={logo}
          text="메인 페이지로 이동 중..."
        >
          <Appbar />

          <div id="section1" className={classes.firstDiv}>
            <Button
              style={{
                width: "50px",
                height: "50px",
              }}
            >
              ASDFSDF
                </Button>
          </div>
          <div id="section2" className={classes.secondDiv}>
          </div>
          <div id="section3" className={classes.thirdDiv}>
          </div>
          <div id="section4" className={classes.fourthDiv}>
          </div>
        </LoadingScreen>
      </>
    );
  }
}

export default withStyles(styles)(mainPage); //withStyles 덕분에 firstDiv가 구별된다.
