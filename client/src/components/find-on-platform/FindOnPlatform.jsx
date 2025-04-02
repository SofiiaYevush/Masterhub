import React from "react";
import Search from "../search/Search";
import "./FindOnPlatform.scss";
import { useTranslation } from 'react-i18next';

function FindOnPlatform() {
  const { t } = useTranslation("find-on-platform");
  return (
    <div className="find__container">
      <div className="find__left-container">
        <img src="../../icons/logo-maroon.png" alt="Icon 1" className="icon icon1" />
        <img src="../../icons/logo-white-big.png" alt="Icon 2" className="icon icon2" />
        <img src="../../icons/logo-maroon.png" alt="Icon 3" className="icon icon3" />
        <img src="../../icons/logo-white-big.png" alt="Icon 4" className="icon icon4" />
      </div>
      <div className="find__center-container">
        <div className="find__top-container">
          <p className="find__title">{t('find-on-platform.title')}</p>
        </div>
        <div className="find__bottom-container">
            <Search />
        </div>
      </div>
      <div className="find__right-container">
        <img src="../../img/woman-categories.jpg" alt="Woman photo" />
      </div>
    </div>
  )
}

export default FindOnPlatform;
