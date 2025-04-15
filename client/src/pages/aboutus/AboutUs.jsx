import React from "react";
import "./AboutUs.scss";
import { useTranslation } from 'react-i18next';

function AboutUs() {
    const { t } = useTranslation("about-us");

    return (
        <div  className="about-us">
            <div className="about-us__heading container">
                <div className="about-us__heading-logo">
                    <img src="../../icons/logo-maroon.png" alt="Logo"/>
                </div>
                <div className="about-us__heading-text-container">
                    <p><i><b>{t('about-us.headingTitle')}</b></i>{t('about-us.headingText')}</p>
                </div> 
            </div>

            <div className="devider"></div>

            <div className="about-us__main-containers">
                <div className="about-us__main-one-container">
                    <img src="../../img/about-us-1.jpg" alt=""/>
                    <div className="about-us__main-one-container-title-text">
                        <h2>{t('about-us.titleOne')}</h2>
                        <p>{t('about-us.textOne')}</p>
                    </div>
                </div>
                <div className="about-us__main-one-container">
                    <div className="about-us__main-one-container-title-text">
                        <h2>{t('about-us.titleTwo')}</h2>
                        <p>{t('about-us.textTwo')}</p>
                    </div>
                    <img src="../../img/about-us-2.png" alt=""/>
                </div>
                <div className="about-us__main-one-container">
                    <img src="../../img/about-us-3.jpg" alt=""/>
                    <div className="about-us__main-one-container-title-text">
                        <h2>{t('about-us.titleThree')}</h2>
                        <p>{t('about-us.textThree')}</p>
                    </div>
                </div>
                <div className="about-us__main-one-container">
                    <div className="about-us__main-one-container-title-text">
                        <h2>{t('about-us.titleFourth')}</h2>
                        <p>{t('about-us.textFourth')}</p>
                    </div>
                    <img src="../../img/about-us-4.jpg" alt=""/>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;