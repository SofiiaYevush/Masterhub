import React from "react";
import "./Slide.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from 'react-i18next';
import getCurrentUser from "../../utils/getCurrentUser";

const CustomArrow = ({ type, onClick }) => (
  <button
    className={`custom-arrow ${type}`}
    onClick={onClick}
  >
    {type === "prev" ? "‹" : "›"}
  </button>
);

const Slide = ({ children, slidesToShow = 1, slidesToScroll = 1 }) => {
  const { t } = useTranslation("slides");
  const currentUser = getCurrentUser();

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
      <h2 className="slides-title">
        {currentUser?.isSeller
          ? t("slides.categoriesTitleTasker")
          : t("slides.categoriesTitle")}
      </h2>
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

export default Slide;