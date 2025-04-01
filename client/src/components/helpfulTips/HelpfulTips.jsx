import React from "react";
import "./HelpfulTips.scss";
import { useTranslation } from 'react-i18next';

function Devider() {
    const { t } = useTranslation("helpful-tips");

    return (
        <div className="helpful-tips">
            <div className="top-container">
                <div className="decorative-check-marks">
                    <img src="../../icons/checked.png" alt="Check mark" />
                    <img src="../../icons/checked.png" alt="Check mark" />
                    <img src="../../icons/checked.png" alt="Check mark" />
                </div>
                <div className="text">
                    <p>{t('helpful-tips.text1')}<br/></p>
                    <p>{t('helpful-tips.text2')}<br/></p>
                    <p>{t('helpful-tips.text3')}</p>
                </div>
            </div>
            <div className="bottom-container">
                <div className="title"><h2>{t('helpful-tips.helpfulTips')}</h2></div>
                <div className="logo-img">
                <img src="../../icons/logo-maroon.png" alt="Logo" />
                </div>
            </div>
        </div>
    )
}

export default Devider;
