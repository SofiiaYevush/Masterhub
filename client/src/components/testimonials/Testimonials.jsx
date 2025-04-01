import React from "react";
import "./Testimonials.scss";
import { useTranslation } from 'react-i18next';

function Testimonials() {
    const { t } = useTranslation("testimonials");
  return (
    <div className="testimonials container">
        <div className="testimonials__left-container">
            <div className="testimonials__decorive-title-container">
                <div className="testimonials__mini-devider-left"></div>
                <h4 className="testimonials__decorive-title">{t('testimonials.warmWords')}</h4>
                <div className="testimonials__mini-devider-right"></div>
            </div>
            <div className="testimonials__main-title-container">
                <h2>{t('testimonials.reviews')}</h2>
            </div>
            <div className="testimonials__title-description">
                <p>{t('testimonials.description')}</p>
            </div>
            <div className="testimonials__list">
                <div className="testimonials__photo-text">
                    <div className="testimonials__photo-container">
                        <img src="../../img/testimonial-user1.jpg" alt="User photo" className="testimonials__photo" />
                    </div>
                    <div className="testimonials__name-text">
                        <div className="testimonials__name-container">
                            <h3 className="testimonials__name">{t('testimonials.name1')}</h3>
                        </div>
                        <div className="testimonials__text-container">
                            <p className="testimonials__text">{t('testimonials.review1')}</p>
                        </div>
                    </div>
                </div>
                <div className="testimonials__photo-text">
                    <div className="testimonials__photo-container">
                        <img src="../../img/testimonial-user2.jpg" alt="User photo" className="testimonials__photo" />
                    </div>
                    <div className="testimonials__name-text">
                        <div className="testimonials__name-container">
                            <h3 className="testimonials__name">{t('testimonials.name2')}</h3>
                        </div>
                        <div className="testimonials__text-container">
                            <p className="testimonials__text">{t('testimonials.review2')}</p>
                        </div>
                    </div>
                </div>
                <div className="testimonials__photo-text">
                    <div className="testimonials__photo-container">
                        <img src="../../img/testimonial-user3.jpg" alt="User photo" className="testimonials__photo" />
                    </div>
                    <div className="testimonials__name-text">
                        <div className="testimonials__name-container">
                            <h3 className="testimonials__name">{t('testimonials.name3')}</h3>
                        </div>
                        <div className="testimonials__text-container">
                            <p className="testimonials__text">{t('testimonials.review3')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="testimonials__right-container">
            <img className="testimonials__image-right-container" src="../../img/testimonials-unregistered.jpg" alt="Happy woman photo" />
        </div>
    </div>
  )
}

export default Testimonials;
