import React from "react";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { categories } from "../../data";
import "./Jobs.scss";

const Jobs = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation(["job", "data"]);
  const categoriesList = categories();

  const { data, isLoading, error } = useQuery({
    queryKey: ["jobs", search],
    queryFn: () =>
      newRequest.get(`/jobs${search}`).then((res) => res.data),
  });

  if (isLoading) return <p>{t("job.jobs.loadingJobs")}</p>;
  if (error) return <p>{t("job.jobs.errorLoadingJobs")}</p>;

  return (
    <div className="jobs">
      <div className="jobs-container">
        <h1>{t('job.jobs.availableJobs')}</h1>

        {data?.length === 0 && (
          <p className="no-jobs">{t("job.jobs.noJobsFound")}</p>
        )}

        {data?.map((job) => (
          <div
            key={job._id}
            className="job-card"
          >
            <h2>{job.title}</h2>

            <p>
              {job.desc ? job.desc.slice(0, 100) : t("job.jobs.noDescription")}...
            </p>

            <div className="job-meta">

              <div className="meta-row">
                <span className="meta-label">{t("job.jobs.category")}:</span>
                <span className="meta-value">
                  {
                    categoriesList.find(cat => cat.key === job.category)?.title
                    || job.category
                  }
                </span>
              </div>

              <div className="meta-row">
                <span className="meta-label">{t("job.jobs.budget")}:</span>
                <span className="meta-value">
                  {job.budget}
                  {job.isBudgetNegotiable && t("job.jobs.budgetNegotiable")}
                </span>
              </div>

              <div className="meta-row">
                <span className="meta-label">{t("job.jobs.location")}:</span>
                <span className="meta-value">
                  {job.location || "-"}
                </span>
              </div>

            </div>

            <div className="job-bottom">
              <span className={`job-status ${job.status}`}>
                {t(`job.jobs.statuses.${job.status}`)}
              </span>

              <button
                className="view-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/jobs/${job._id}/details`);
                }}
              >
                {t("job.jobs.viewBtn")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div >
  );
};

export default Jobs;