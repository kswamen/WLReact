import React, { Component } from "react";
import NewsCarousel from "../components/NewsCarousel";
import PatientsTable from "../components/PatientsTable";
import bg1 from "../image/bg1.jpeg";
import Appbar from "../components/Appbar";
import "../css/mainPage.css";
import LoadingScreen from "react-loading-screen";

import { post } from "axios";


class mainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      c: [1, 2, 3, 4]
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
          <PatientsTable />
        </div>
        <div id="section2" className='secondDiv'>
          <NewsCarousel />
        </div>

      </>
    );
  }
}

export default mainPage; //withStyles 덕분에 firstDiv가 구별된다.
