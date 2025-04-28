import React from "react";
import { Link } from "react-router-dom";
import "./CatCard.scss";

function CatCard({ card }) {
  return (
    <Link to={`/gigs?cat=${card.key}`} key={card.key}>
      <div className="catCard">
        <img src={card.img} alt={card.title} />
        <span className="catCard-title">{card.title}</span>
      </div>
    </Link>
  );
}
export default CatCard;
