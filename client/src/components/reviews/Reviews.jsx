import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import newRequest from "../../utils/newRequest";
import Review from "../review/Review";
import "./Reviews.scss";
import { useTranslation } from 'react-i18next';

const Reviews = ({ gigId }) => {
  const { t } = useTranslation("reviews");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const queryClient = useQueryClient()
  const { isLoading, error, data } = useQuery({
    queryKey: ["reviews"],
    queryFn: () =>
      newRequest.get(`/reviews/${gigId}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (review) => {
      return newRequest.post("/reviews", review);
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(["reviews"])
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const desc = e.target[0].value;
    const star = e.target[1].value;
    mutation.mutate({ gigId, desc, star });
  };

  return (
    <div className="reviews">
      <h2 className="reviews-title">{t('reviews.reviewsTitle')}</h2>
      {isLoading
        ? "loading"
        : error
        ? "Something went wrong!"
        : data.map((review) => <Review key={review._id} review={review} />
      )}
      {!currentUser.isSeller && (
        <div className="add">
          <h3>{t('reviews.add')}</h3>
          <form action="" className="addForm" onSubmit={handleSubmit}>
            <input type="text" placeholder={t('reviews.placeholder')} />
            <div className="select-stars-container">
              <p className="select-title">{t('reviews.giveStars')}</p>
              <select name="" id="">
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
            <button className="addForm__red-button">{t('reviews.sendButton')}</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Reviews;
