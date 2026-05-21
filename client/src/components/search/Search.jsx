import React, { useState } from "react";
import "./Search.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import getCurrentUser from "../../utils/getCurrentUser";

function Search() {
  const { t } = useTranslation("search");
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const currentUser = getCurrentUser();

  const handleSubmit = () => {
    if (currentUser.isSeller) {
      navigate(`/jobs?cat=${input}`);
    }
    if (!currentUser.isSeller) {
      navigate(`/gigs?search=${input}`);
    }
  };
  return (
    <div className="search">
      <div className="container">
        <div className="search">
          <div className="searchInput">
            <img src="../../img/search.png" alt="" />
            <input
              type="text"
              placeholder={t('search.placeholder')}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <button className="searchButton" onClick={handleSubmit}>{t('search.searchButton')}</button>
        </div>
      </div>
    </div>
  )
}

export default Search;
