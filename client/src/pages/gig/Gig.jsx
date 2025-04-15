import React from "react";
import "./Gig.scss";
import { Slider } from "infinite-react-carousel/lib";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";
import getCurrentUser from "../../utils/getCurrentUser";
import { useTranslation } from 'react-i18next';

function Gig() {
  const { t } = useTranslation("gig");
  const { id } = useParams();

  const currentUser = getCurrentUser();

  const { isLoading, error, data } = useQuery({
    queryKey: ["gig"],
    queryFn: () =>
      newRequest.get(`/gigs/single/${id}`).then((res) => {
        return res.data;
      }),
  });

  const userId = data?.userId;

  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      newRequest.get(`/users/${userId}`).then((res) => {
        return res.data;
      }),
    enabled: !!userId,
  });

  const navigate = useNavigate();

  const handleHire = async (gigId) => {
    try {
      await newRequest.post("/orders", { gigId });
      navigate("/orders");
    } catch (err) {
      console.log(err);
    }
  };
  

  if (isLoading) return <p>Loading...</p>;

  const CustomArrow = ({ type, onClick }) => (
    <button
      className={`carousel-arrow ${type === "prev" ? "left" : "right"}`}
      onClick={onClick}
    >
      {type === "prev" ? "‹" : "›"}
    </button>
  );

  return (
    <div className="gig">
      {isLoading ? (
        "loading"
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="gig__container">
          <div className="left">
            <h1>{data.title}</h1>
            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="user">
                <img
                  className="user-image"
                  src={dataUser.img || "/img/noavatar.jpg"}
                  alt=""
                />
                <span>{dataUser.username}</span>
              </div>              
            )}
            {Array.isArray(data.images) && data.images.length > 0 && (
              <Slider
                slidesToShow={1}
                arrowsScroll={1}
                className="slider"
                prevArrow={<CustomArrow type="prev" />}
                nextArrow={<CustomArrow type="next" />}
              >
                {data.images.map((img) => (
                  <img key={img} src={img} alt="" />
                ))}
              </Slider>
            )}
            <h2>{t('gig.aboutService')}</h2>
            <p>{data.desc}</p>
            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="seller">
                <h2>{t('gig.aboutSeller')}</h2>
                <div className="gig__user-box">
                  <div className="box-left-container">
                    <img src={dataUser.img || "../../img/noavatar.jpg"} alt="" />
                  </div>
                  <div className="box-right-container">
                    <div className="box-right-top">
                      <div className="box-right-top-username">
                        <span>{dataUser.username}</span>
                      </div>
                      <div className="box-right-top-stars">
                        {!isNaN(data.totalStars / data.starNumber) && (
                          <div className="stars">
                            {Array(Math.round(data.totalStars / data.starNumber))
                              .fill()
                              .map((item, i) => (
                                <img src="../../img/star.png" alt="" key={i} />
                            ))}
                            <span>{Math.round(data.totalStars / data.starNumber)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="box-right-center">
                      <p className="box-center-text">{dataUser.desc}</p>
                      <hr />
                    </div>
                    <div className="box-right-bottom">
                      <div className="box-country">
                        <img src="../../icons/location.png" alt="" />
                        <span className="box-bottom-text">{dataUser.country}</span>
                      </div>
                      <div className="box-phone">
                        <img src="../../icons/phone.png" alt="" />
                        <span className="box-bottom-text">{dataUser.phone}</span>
                      </div>
                    </div>
                  </div>                  
                </div>
              </div>
            )}
            <Reviews gigId={id} />
          </div>
          <div className="right">
            <div className="price">
              <h3>{data.shortTitle}</h3>
              <h2>$ {data.price}</h2>
            </div>
            <p  className="description">{data.shortDesc}</p>
            <div className="details">
              <div className="item">
                <img src="../../img/clock.png" alt="" />
                <span>{data.deliveryTime} {t('gig.daysDelivery')}</span>
              </div>
              <div className="item">
                <img src="../../icons/location-service.png" alt="" />
                <span>{data.location}</span>
              </div>
            </div>
            <div className="features">
              {data.features.map((feature) => (
                <div className="item" key={feature}>
                  <img src="../../icons/hashtag.png" alt="" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            {!currentUser.isSeller && (
              <button
              className="hire-red-button"
              onClick={() => handleHire(data._id)}
            >
              {t('gig.hireButton')}
            </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Gig;
