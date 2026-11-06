
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import newRequest from "../../utils/newRequest";
import UserAvatar from "../../components/user-avatar/UserAvatar";
import "./UserProfile.scss";

const formatDate = (date, language) => {
  if (!date) return "";

  return new Intl.DateTimeFormat(language === "uk" ? "uk-UA" : "en-GB", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

const UserProfile = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation("user-profile");

  const { data, isLoading, error } = useQuery({
    queryKey: ["publicProfile", id],
    queryFn: () =>
      newRequest.get(`/users/${id}/public-profile`).then((res) => res.data),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="user-profile__message">{t("userProfile.loading")}</div>;
  }

  if (error || !data?.user) {
    return (
      <div className="user-profile__message">
        {t("userProfile.notFound")}
      </div>
    );
  }

  const { user, gigs = [], jobs = [], reviews = [], stats = {} } = data;
  const isTasker = user.isSeller;

  return (
    <main className="user-profile">
      <div className="user-profile__container">
        <section className="profile-header">
          <div className="profile-header__main">
            <UserAvatar
              img={user.img}
              cardVerified={user.cardVerified}
              size={112}
            />

            <div className="profile-header__info">
              <div className="profile-header__name-row">
                <h1>{user.username}</h1>

                {user.cardVerified && (
                  <span
                    className="profile-verified"
                    title={t("paymentVerified")}
                  >
                    <span className="profile-verified__check">✓</span>
                    {t("userProfile.verified")}
                  </span>
                )}
              </div>

              <span className="profile-role">
                {isTasker ? t("userProfile.tasker") : t("userProfile.client")}
              </span>

              <div className="profile-header__meta">
                {user.country && (
                  <span>
                    <span aria-hidden="true">⌖</span>
                    {user.country}
                  </span>
                )}

                {user.createdAt && (
                  <span>
                    <span aria-hidden="true">◷</span>
                    {t("userProfile.memberSince", {
                      date: formatDate(user.createdAt, i18n.language),
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>

          {user.desc && (
            <p className="profile-header__description">{user.desc}</p>
          )}
        </section>

        <section className="profile-stats">
          {isTasker ? (
            <>
              <div className="profile-stat">
                <strong>{stats.gigsCount ?? gigs.length}</strong>
                <span>{t("userProfile.stats.services")}</span>
              </div>

              <div className="profile-stat">
                <strong>{stats.reviewsCount ?? reviews.length}</strong>
                <span>{t("userProfile.stats.reviews")}</span>
              </div>

              <div className="profile-stat">
                <strong>
                  {stats.reviewsCount > 0
                    ? Number(stats.averageRating).toFixed(1)
                    : "—"}
                </strong>
                <span>{t("userProfile.stats.rating")}</span>
              </div>
            </>
          ) : (
            <>
              <div className="profile-stat">
                <strong>{stats.jobsCount ?? jobs.length}</strong>
                <span>{t("userProfile.stats.jobs")}</span>
              </div>

              <div className="profile-stat">
                <strong>{reviews.length}</strong>
                <span>{t("userProfile.stats.reviewsLeft")}</span>
              </div>
            </>
          )}
        </section>

        {isTasker ? (
          <section className="profile-section">
            <div className="profile-section__heading">
              <h2>{t("userProfile.servicesTitle")}</h2>
              <span>{gigs.length}</span>
            </div>

            {gigs.length === 0 ? (
              <p className="profile-empty">{t("userProfile.noServices")}</p>
            ) : (
              <div className="profile-gigs">
                {gigs.map((gig) => (
                  <Link
                    to={`/gig/${gig._id}`}
                    className="profile-gig-card"
                    key={gig._id}
                  >
                    <div className="profile-gig-card__image">
                      <img
                        src={gig.cover || "/img/noavatar.jpg"}
                        alt={gig.title}
                      />
                    </div>

                    <div className="profile-gig-card__content">
                      <h3>{gig.title}</h3>
                      <p>{gig.shortDesc || gig.desc}</p>

                      <div className="profile-gig-card__footer">
                        <span className="profile-gig-card__rating">
                          ★{" "}
                          {gig.starNumber > 0
                            ? (gig.totalStars / gig.starNumber).toFixed(1)
                            : "—"}
                          <span>({gig.starNumber || 0})</span>
                        </span>

                        <strong>
                          {gig.isPriceNegotiable
                            ? t("userProfile.negotiable")
                            : `₴ ${gig.price}`}
                        </strong>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="profile-section">
            <div className="profile-section__heading">
              <h2>{t("userProfile.jobsTitle")}</h2>
              <span>{jobs.length}</span>
            </div>

            {jobs.length === 0 ? (
              <p className="profile-empty">{t("userProfile.noJobs")}</p>
            ) : (
              <div className="profile-jobs">
                {jobs.map((job) => (
                  <Link
                    to={`/jobs/${job._id}/details`}
                    className="profile-job-card"
                    key={job._id}
                  >
                    <div className="profile-job-card__top">
                      <h3>{job.title}</h3>
                      <span className={`profile-job-status ${job.status}`}>
                        {t(`userProfile.jobStatuses.${job.status}`, {
                          defaultValue: job.status,
                        })}
                      </span>
                    </div>

                    <p>{job.desc}</p>

                    <div className="profile-job-card__meta">
                      <span>{job.category}</span>
                      <strong>
                        {job.isBudgetNegotiable
                          ? t("userProfile.negotiable")
                          : job.budget != null
                            ? `₴ ${job.budget}`
                            : t("userProfile.budgetNotSpecified")}
                      </strong>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="profile-section profile-reviews">
          <div className="profile-section__heading">
            <h2>
              {isTasker ? t("userProfile.receivedReviews") : t("userProfile.writtenReviews")}
            </h2>
            <span>{reviews.length}</span>
          </div>

          {reviews.length === 0 ? (
            <p className="profile-empty">
              {isTasker ? t("userProfile.noReceivedReviews") : t("userProfile.noWrittenReviews")}
            </p>
          ) : (
            <div className="profile-reviews__list">
              {reviews.map((review) => {
                const reviewUser = isTasker
                  ? review.reviewer
                  : review.recipient;

                return (
                  <article className="profile-review" key={review._id}>
                    <div className="profile-review__top">
                      <div className="profile-review__author">
                        <Link to={`/user/${reviewUser?._id}`} className="user user-profile-link profile-review__author-link">
                          <UserAvatar
                            img={reviewUser?.img}
                            size={42}
                          />
                          <div>
                            <strong>
                              {reviewUser?.username || t("userProfile.unknownUser")}
                            </strong>
                            <span>
                              {formatDate(review.createdAt, i18n.language)}
                            </span>
                          </div>
                        </Link>
                      </div>

                      <span className="profile-review__rating">
                        {"★".repeat(review.star)}
                        <span>{"★".repeat(5 - review.star)}</span>
                      </span>
                    </div>

                    {review.gig?.title && (
                      <p className="profile-review__service">
                        {t("userProfile.reviewedService")}: {review.gig.title}
                      </p>
                    )}

                    <p className="profile-review__description">
                      {review.desc}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default UserProfile;
