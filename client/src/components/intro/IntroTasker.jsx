import React from "react";
import { Link } from "react-router-dom";
import "./IntroTasker.scss";
import { useTranslation } from 'react-i18next';

function IntroTasker() {
    const { t } = useTranslation("introTasker");

    return (
        <div className="home-tasker__intro">
            <div className="home-tasker__intro-text-button">
                <h1 className="home-tasker__intro-title">{t('introTasker.introTitle')}</h1>
                <p className="home-tasker__intro-text">
                    {t('introTasker.aboutFirstLine')}<br/>
                    {t('introTasker.aboutSecondLine')}<br/>
                    {t('introTasker.aboutThirdLine')}<br/>
                </p>
                <Link className="link" to="/add">
                    <button className="home-tasker__red-button" role="button">{t('introTasker.introButon')}</button>
                </Link>
            </div>
            <div className="home-tasker__intro-image-container">
                <img src="../../img/home-registered.jpg" alt="Happy woman image"/>
            </div>
        </div>
    );
}

export default IntroTasker;