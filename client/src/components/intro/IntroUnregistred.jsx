import React from "react";
import "./IntroUnregistred.scss";
import { useTranslation } from 'react-i18next';

function IntroUnregistred() {
  const { t } = useTranslation("introUnregistred");

  return (
    <div className="intro">
      <div className="container">
        <div className="left">
          <img src="../../img/home-page-intro.png" alt="home page intro" />
        </div>
        <div className="right">
          <div className="titles">
            <p className="title">
              {t('introUnregistred.titleTop')}
            </p>
            <p className="title">
              {t('introUnregistred.titleBottom')}
            </p>
          </div>
          <p className="text">
            {t('introUnregistred.aboutFirstLine')}
          </p>
          <p className="text">
            {t('introUnregistred.aboutSecondLine')}
          </p>
          <p className="text">
            {t('introUnregistred.aboutThirdLine')}
          </p>
          <div className="buttons">
          <button className="red-button button-try-now">{t('introUnregistred.buttonTryNow')}</button>
          <button className="white-button">{t('introUnregistred.buttonLearnMore')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IntroUnregistred;
