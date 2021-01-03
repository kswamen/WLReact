import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import NewsCarousel from "../components/NewsCarousel";
import bg1 from "../image/bg1.jpeg";
import bg2 from "../image/bg2.jpg";
import bg3 from "../image/bg3.jpg";
import Appbar from "../components/Appbar";
import logo from "../image/mask.png";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import "../css/mainPage.css";
import LoadingScreen from "react-loading-screen";

import { LoginContext } from "../components/LoginContext";

import { post } from "axios";


class mainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  handleFileOnChange = (event) => {
    // 서버 api에 Post 요청
    const formData = new FormData();
    formData.append('profile_img', bg1);
    post('/api/image', formData, {
      header: { 'content-type': 'multipart/form-data' },
    }).then((response) => {
      console.log({ response });
    });
  };

  componentDidMount() {
    let that = this;
    setTimeout(function () {
      that.setState({ isLoading: false });
    }, 2000);
  }

  render() {
    return (
      <>
        <Appbar />
        <div id="section1" className='firstDiv'>
          <NewsCarousel />
        </div>
        <div id="section2" className='secondDiv'>
        </div>
        <div id="section3" className='thirdDiv'>
        </div>
      </>
    );
  }
}

export default mainPage; //withStyles 덕분에 firstDiv가 구별된다.
