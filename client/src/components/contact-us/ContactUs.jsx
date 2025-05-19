import React from "react";
import "./ContactUs.scss";
import { useTranslation } from 'react-i18next';

function Categories() {
    const { t } = useTranslation("contact-us");

    return (
            <div className="contact-us">
            <h2 className="contact-us__main-title">{t("contact-us.main-title")}</h2>
              <div className="contact-us__title-text-container">
                <div className="contact-us__phone-section">
                    <img className="contact-us__img" src="../../icons/contact-us-phone.png" alt="Phone icon" />
                    <h3 className="contact-us__section-title">{t("contact-us.phone-title")}</h3>
                    <p className="contact-us__section-text">+38(063)450-77-13</p>
                </div>
                <div className="v-divider"></div>
                <div className="contact-us__hours-section">
                    <img className="contact-us__img" src="../../icons/contact-us-hours.png" alt="Hours icon" />
                    <h3 className="contact-us__section-title">{t("contact-us.hours-title")}</h3>
                    <p className="contact-us__section-text-top">{t("contact-us.days")}</p>
                    <p className="contact-us__section-text">{t("contact-us.hours")}</p>
                </div>
                <div className="v-divider"></div>
                <div className="contact-us__contact-section">
                    <img className="contact-us__img" src="../../icons/contact-us-email.png" alt="Email icon" />
                    <h3 className="contact-us__section-title">{t("contact-us.contact-title")}</h3>
                    <p className="contact-us__section-text">admin@masterhub.com</p>
                </div>
              </div>
            </div>
        );
    }

export default Categories;
