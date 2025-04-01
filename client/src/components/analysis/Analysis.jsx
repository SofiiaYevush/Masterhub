import React from "react";
import "./Analysis.scss";
import { useTranslation } from 'react-i18next';

function Analysis() {
    const { t } = useTranslation("analysis");
    return (
        <div className="analysis container">
        <div className="analysis__title">
            <h2>{t('analysis.title')}</h2>
        </div>
        <div className="analysis__text-container">
            <div className="analysis__statement">
                <div className="analysis__statement-numbers"><p>{t('analysis.number1')}</p></div>
                <div className="analysis__statement-numbers-description"><p>{t('analysis.description1')}</p></div>
            </div>
            <div className="analysis__statement">
                <div className="analysis__statement-numbers"><p>{t('analysis.number2')}</p></div>
                <div className="analysis__statement-numbers-description"><p>{t('analysis.description2')}</p></div>
            </div>
            <div className="analysis__statement">
                <div className="analysis__statement-numbers"><p>{t('analysis.number3')}</p></div>
                <div className="analysis__statement-numbers-description"><p>{t('analysis.description3')}</p></div>
            </div>
        </div>
    </div>
    )
}

export default Analysis;
