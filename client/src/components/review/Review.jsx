import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import newRequest from "../../utils/newRequest";
import "./Review.scss";
const Review = ({ review }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };
  
  const { isLoading, error, data } = useQuery(
    {
      queryKey: [review.userId],
      queryFn: () =>
        newRequest.get(`/users/${review.userId}`).then((res) => {
          return res.data;
        }),
    },
  );

  return (
    <div className="review">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="review-container">
          <div className="review__left-container">
            <img className="review__user-photo" src={data.img || "/img/noavatar.jpg"} alt="" />
          </div>
          <div className="review__right-container">
            <div className="review__right-top-container">
              <span className="review__username">{data.username}</span>
              <div className="helpful">
                <div className={`review__like ${liked ? "active" : ""}`} onClick={handleLike}>
                  <img src="../../icons/like.png" alt="like" />
                </div>
                <div className={`review__dislike ${disliked ? "active" : ""}`} onClick={handleDislike}>
                  <img src="../../icons/dislike.png" alt="dislike" />
                </div>
              </div>
            </div>
            <div className="review__right-bottom-container">
              <div className="stars">
                {Array(review.star)
                  .fill()
                  .map((item, i) => (
                    <img src="/img/star.png" alt="" key={i} />
                  ))}
                <span>{review.star}</span>
              </div>
              <p className="review__text-review">{review.desc}</p>
            </div>
        </div>
      </div>
      )}  
    </div>
  );
};

export default Review;
