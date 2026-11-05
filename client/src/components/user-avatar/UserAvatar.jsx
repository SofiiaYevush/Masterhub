import React from "react";

import "./UserAvatar.scss";
const UserAvatar = ({
  img,
  cardVerified = false,
  alt = "",
  size = 26,
}) => {
  return (
    <div
      className="user-avatar"
      style={{ "--avatar-size": `${size}px` }}
    >
      <img
        src={img || "/img/noavatar.jpg"}
        alt={alt}
        className="user-avatar__image"
      />

      {cardVerified && (
        <span
          className="user-avatar__verified"
          title="Verified"
          aria-label="Verified user"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M3.5 8.2 6.5 11l6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </div>
  );
};

export default UserAvatar;