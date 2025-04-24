import React from "react";
import "./ReadyToStart.scss";
import { useTranslation } from 'react-i18next';

function ReadyToStart() {
    const { t } = useTranslation("ready-to-start");
    return (
        <div className="ready-to-start">
            <div className="ready-to-start__image-container">
                <img src="../../img/home-page-ready-to-start.jpeg" alt="Woman talking" />
            </div>
            <div className="ready-to-start__text-button-container">
                <div className="ready-to-start__title"><h2>{t('ready-to-start.readyToStart')}</h2></div>
                <div className="ready-to-start__text"><p>{t('ready-to-start.description')}</p></div>
                <div className="ready-to-start__button">
                    <button className="red-with-white-border-button"><a href="/" target="_blank">{t('ready-to-start.signUpBtn')}</a></button>
                </div>
            </div>
        </div>
    )
}

export default ReadyToStart;