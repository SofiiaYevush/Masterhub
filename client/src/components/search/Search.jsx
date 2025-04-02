import React, { useState } from "react";
import "./Search.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function Search() {
  const { t } = useTranslation("search");
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/gigs?search=${input}`);
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
