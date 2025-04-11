import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const GigCard = ({ item }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [item.userId],
    queryFn: () =>
      newRequest.get(`/users/${item.userId}`).then((res) => {
        return res.data;
      }),
  });
  return (
    <Link to={`/gig/${item._id}`} className="link">
      <div className="card">
        <img src={item.cover} alt="" />
        <div className="card-info">
          <div className="card-info-top">
            {isLoading ? (
              "loading"
            ) : error ? (
              "Something went wrong!"
            ) : (
              <div className="user">
                <img src={data.img || "/img/noavatar.jpg"} alt="" />
                <span>{data.username}</span>
              </div>
            )}
            <p className="card-text">{item.title}</p>
          </div>
          <div className="card-info-bottom">
            <div className="card-price">
              <span className="card-label">Price:</span>
              <h2 className="price">$ {item.price}</h2>
            </div>
            <div className="card-date">
              <span className="card-label">Created:</span>
              <span className="date">
                {new Date(item.createdAt).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
