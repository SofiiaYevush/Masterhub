import React from "react";
import "./Categories.scss";
import { useTranslation } from 'react-i18next';

function Categories() {
    const { t } = useTranslation("categories", "data");

    return (
        <div className="categories">
            <div className="explore">
                <div className="categories-container">
                    <h1>{t('categories.title')}</h1>
                    <div className="items">
                        <div className="item">
                            <img
                                src="../../icons/woodworking.png"
                                alt="Category icon"
                            />
                            <div className="line"></div>
                            <span>{t('woodworking.title', { ns: 'data' })}</span>
                        </div>
                        <div className="item">
                            <img
                                src="../../icons/cleaning.png"
                                alt="Category icon"
                            />
                            <div className="line"></div>

                            <span>{t('cleaning.title', { ns: 'data' })}</span>
                        </div>
                        <div className="item">
                            <img
                                src="../../icons/moving.png"
                                alt="Category icon"
                            />
                            <div className="line"></div>
                            <span>{t('moving.title', { ns: 'data' })}</span>
                        </div>
                            <div className="item">
                            <img
                                src="../../icons/houseRepair.png"
                                alt="Category icon"
                            />
                            <div className="line"></div>
                            <span>{t('houseRepair.title', { ns: 'data' })}</span>
                        </div>
                        <div className="item">
                            <img
                                src="../../icons/gardening.png"
                                alt="Category icon"
                            />
                            <div className="line"></div>
                            <span>{t('gardening.title', { ns: 'data' })}</span>
                        </div>
                        <div className="item">
                            <img
                                src="../../icons/makeup.png"
                                alt="Category icon"
                            />
                            <div className="line"></div>
                            <span>{t('makeup.title', { ns: 'data' })}</span>
                        </div>
                        <div className="item">
                            <img
                                src="../../icons/homeDesign.png"
                                alt="Category icon"
                            />
                            <div className="line"></div>
                            <span>{t('homeDesign.title', { ns: 'data' })}</span>
                        </div>
                        <div className="item">
                            <img
                                src="../../icons/childCare.png"
                                alt="Category icon"
                            />
                            <div className="line"></div>
                            <span>{t('childCare.title', { ns: 'data' })}</span>
                        </div>
                        <div className="item">
                            <img
                                src="../../icons/technicalServices.png"
                                alt="Category icon"
                            />
                            <div className="line"></div>
                            <span>{t('technicalServices.title', { ns: 'data' })}</span>
                        </div>
                        <div className="item">
                            <img
                                src="../../icons/cooking.png"
                                alt="Category icon"
                            />
                            <div className="line"></div>
                            <span>{t('cooking.title', { ns: 'data' })}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Categories;