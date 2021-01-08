import React from "react";
import Slider from "react-slick";
import { post } from "axios";
import "../css/carousel.css";

class NewsCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newsData: [],
    };
  }

  componentWillMount() {
    this.callApi().then((res) => {
      this.setState({
        newsData: res,
      });
    });
  }

  callApi = async () => {
    const response = await fetch("/api/news");
    const body = await response.json();
    return body;
  };

  render() {
    var settings = {
      dots: true,
      infinite: true,
      speed: 1000,
      slidesToShow: 2,
      slidesToScroll: 2,
      arrows: true,
      centerMode: false,
      centerPadding: 0,
      autoplay: true,
      rows: 2,
      slidesPerRow: 1,
      autoplaySpeed: 8000,
      //initialSlide: 1,
      //centerPadding: "px",
      //slidesPerRow: 3,
    };

    const newsComponent = (data) => {
      return data.map((news, i) => {
        return (
          <div className="div-slider">
            <a href={news.a} target={"_blank"}>
              <img src={news.src} />
              <div>
                <h3>
                  <text> {news.title}</text>
                </h3>
              </div>
              <text style={{ borderRadius: 0 }}>{news.subtitle}</text>
            </a>
          </div>
        );
      });
    };

    return (
      <Slider
        style={{
          width: "75%",
          height: "50%",
          top: '10.5vh'
        }}
        className="carousel-slider"
        {...settings}
      >
        {newsComponent(this.state.newsData)}
      </Slider>
    );
  }
}

export default NewsCarousel;
