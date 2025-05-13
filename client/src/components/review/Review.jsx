import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "./Review.scss";

const Review = ({ review }) => {
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const { isLoading, error, data } = useQuery({
    queryKey: [review.userId],
    queryFn: () =>
      newRequest.get(`/users/${review.userId}`).then((res) => res.data),
  });

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (review.likes?.includes(currentUser._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }

    if (review.dislikes?.includes(currentUser._id)) {
      setDisliked(true);
    } else {
      setDisliked(false);
    }
  }, [review, currentUser._id]);

  const mutation = useMutation({
    mutationFn: (type) =>
      newRequest.put(`/reviews/${review._id}/react`, { type }),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const handleLike = () => {
    mutation.mutate("like");
    setLiked((prev) => !prev);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    mutation.mutate("dislike");
    setDisliked((prev) => !prev);
    if (liked) setLiked(false);
  };

  return (
    <div className="review">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="review-container">
          <div className="review__left-container">
            <img
              className="review__user-photo"
              src={data.img || "/img/noavatar.jpg"}
              alt=""
            />
          </div>
          <div className="review__right-container">
            <div className="review__right-top-container">
              <span className="review__username">{data.username}</span>
              <div className="likes">
                <div
                  className={`review__like ${liked ? "active" : ""}`}
                  onClick={handleLike}
                >
                  <img
                    src={
                      liked
                        ? "../../icons/filled-like.png"
                        : "../../icons/like.png"
                    }
                    alt="like"
                  />
                  <span>{review.likes?.length || 0}</span>
                </div>
                <div
                  className={`review__dislike ${disliked ? "active" : ""}`}
                  onClick={handleDislike}
                >
                  <img
                    src={
                      disliked
                        ? "../../icons/filled-dislike.png"
                        : "../../icons/dislike.png"
                    }
                    alt="dislike"
                  />
                  <span>{review.dislikes?.length || 0}</span>
                </div>
              </div>
            </div>
            <div className="review__right-bottom-container">
              <div className="stars">
                {Array(review.star)
                  .fill()
                  .map((_, i) => (
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
