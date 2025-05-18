import React from 'react';
import './AllGigs.scss';
import { useTranslation } from 'react-i18next';

function AllGigs({ gigs, handleDeleteGig }) {
    const { t } = useTranslation("admin");

    return (
        <div className="all-services">
            <h2>{t('admin.all-services-title')}</h2>

            <div className="services-container">
                {gigs.map((gig) => (
                    <div className="service-card"  key={gig._id}>
                        <div className="services__top">
                            <div className="top-title-date">
                                <div className="top-fiels-title">
                                    <p className="service-title">{t('admin.service-title')}</p>
                                    <p>{t('admin.service-created-date')}</p>
                                </div>
                                <div className="top-fiels-text">
                                    <p className="service-text">{gig.title}</p>
                                    <p>{new Date(gig.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="top-btn-status">
                                <div className="top-status">
                                    {gig.isDeleted ? t('admin.service-deleted') :  t('admin.service-available')}
                                </div>
                                <div className="top-btn">
                                    <button onClick={() => handleDeleteGig(gig._id)}>
                                        {t('admin.service-delete')}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="services__center">
                            <div className="center-left">
                                <div className="left-fields-titles">
                                    <p className="service-title">{t('admin.service-category')}</p>
                                    <p className="service-title">{t('admin.service-price')}</p>
                                    <p className="service-title">{t('admin.service-location')}</p>
                                    <p className="service-title">{t('admin.service-delivery-time')}</p>
                                    <p className="service-text-before-username">{t('admin.service-stars')}</p>
                                    <p>{t('admin.service-creator')}</p>
                                </div>
                                <div className="left-fields-text">
                                    <p className="service-text">{gig.cat}</p>
                                    <p className="service-text">₴ {gig.price}</p>
                                    <p className="service-text">{gig.location ? gig.location : "—"}</p>
                                    <p className="service-text">{gig.deliveryTime} {t('admin.service-days')}</p>
                                    <p className="service-text">{gig.totalStars}</p>
                                    <div className="avatar-username">
                                        {gig.userImg ? (
                                            <img
                                            src={gig.userImg}
                                            alt={gig.username}
                                            className="avatar"
                                            />
                                        ) : (
                                            <img className="avatar" src="/img/noavatar.jpg" />
                                        )}
                                        {gig.username}
                                    </div>
                                </div>
                            </div>
                            <div className="center-right">
                                <div className="right-fields-title">
                                    <p className="service-title">{t('admin.service-clients')}</p>
                                    <p>{t('admin.service-cooperation-status')}</p>
                                </div>
                                <div className="right-fields-text">
                                    {gig.clients && gig.clients.length > 0 ? (
                                        <ul className="avatar-username-list">
                                            {gig.clients.map((client, index) => (
                                            <li className="avatar-username" key={index}>
                                                {client.img ? (
                                                    <img
                                                        src={client.img}
                                                        alt={client.username}
                                                        className="avatar"
                                                    />
                                                ) : (
                                                    <img className="avatar" src="/img/noavatar.jpg" />
                                                )}
                                                <div className="client-username-status">
                                                    <p className="client-username">{client.username}</p>
                                                    <p className="client-status">
                                                        {client.status === "Completed"
                                                            ? t("admin.service-completed")
                                                            : t("admin.service-in-progress")
                                                        }
                                                    </p>
                                                </div>
                                            </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="client-nousername-nostatus">
                                            <p className="client-nousername">—</p>
                                            <p className="client-nostatus">—</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="services__bottom">
                            <div className="bottom-fields-title">{t('admin.description')}</div>
                            <div className="top-fiels-text">
                                <p>{gig.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllGigs;
