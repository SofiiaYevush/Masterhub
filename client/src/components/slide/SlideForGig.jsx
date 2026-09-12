import React from "react";
import "./Slide.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from 'react-i18next';

const CustomArrow = ({ type, onClick }) => (
  <button
    className={`custom-arrow ${type}`}
    onClick={onClick}
  >
    {type === "prev" ? "‹" : "›"}
  </button>
);

const SlideForGig = ({ children, slidesToShow = 1, slidesToScroll = 1 }) => {
  const { t } = useTranslation("slides")

  const settings = {
    slidesToShow,
    slidesToScroll,
    infinite: true,
    prevArrow: <CustomArrow type="prev" />,
    nextArrow: <CustomArrow type="next" />,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: Math.min(3, slidesToShow) } },
      { breakpoint: 768, settings: { slidesToShow: Math.min(2, slidesToShow) } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="slide">
      <div className="container">
        <Slider {...settings}>
          {React.Children.map(children, (child, index) => (
            <div key={index}>{child}</div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default SlideForGig;