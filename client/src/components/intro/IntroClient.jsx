import React from "react";
import { Link } from "react-router-dom";
import "./IntroClient.scss";
import { useTranslation } from 'react-i18next';

function IntroClient() {
    const { t } = useTranslation("introClient");

    return (
        <div className="home-client__intro">
            <div className="home-client__intro-text-button">
                <h1 className="home-client__intro-title">{t('introClient.introTitle')}</h1>
                <p className="home-client__intro-text">
                    {t('introClient.aboutFirstLine')}<br/>
                    {t('introClient.aboutSecondLine')}<br/>
                    {t('introClient.aboutThirdLine')}<br/>
                </p>
                <Link className="link" to="/categories">
                    <button className="home-client__red-button" role="button">{t('introClient.introButon')}</button>
                </Link>
            </div>
            <div className="home-client__intro-image-container">
                <img src="../../img/home-registered.jpg" alt="Happy woman image"/>
            </div>
        </div>
    );
}

export default IntroClient;