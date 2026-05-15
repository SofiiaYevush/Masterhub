import React from "react";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "./MyJobs.scss";

const MyJobs = () => {
    const navigate = useNavigate();
    const { t } = useTranslation("job");

    const { data: jobs, isLoading, error } = useQuery({
        queryKey: ["myJobs"],
        queryFn: () => newRequest.get("/jobs/my-jobs").then(res => res.data),
    });

    if (isLoading) return <p className="my-jobs__loading">{t('job.myJobs.loadingJobs')}</p>;
    if (error) return <p className="my-jobs__error">{t('job.myJobs.errorLoadingJobs')}</p>;

    return (
        <div className="my-jobs">
            <h1 className="my-jobs__page-title">{t('job.myJobs.pageTitle')}</h1>
            <div className="jobs-list">
                {jobs?.map(job => (
                    <div key={job._id} className="job-card" onClick={() => navigate(`/jobs/${job._id}/applications`)}>
                        <h2 className="job-title">{job.title}</h2>

                        <div className="job-field">
                            <span className="field-label">{t('job.myJobs.description')}</span>
                            <span className="field-value">{job.desc.slice(0, 20)}...</span>
                        </div>

                        <div className="job-field">
                            <span className="field-label">{t('job.myJobs.category')}</span>
                            <span className="field-value">{job.category}</span>
                        </div>

                        <div className="job-field">
                            <span className="field-label">{t('job.myJobs.budget')}</span>
                            <span className="field-value">
                                {job.budget} {job.isBudgetNegotiable ? t('job.myJobs.budgetNegotiable') : ""}
                            </span>
                        </div>

                        <div className="job-field">
                            <span className="field-label">{t('job.myJobs.location')}</span>
                            <span className="field-value">{job.location || "-"}</span>
                        </div>

                        <div className="job-field">
                            <span className="field-label">{t('job.myJobs.deadline')}</span>
                            <span className="field-value">
                                {job.deadline ? new Date(job.deadline).toLocaleDateString() : "-"}
                            </span>
                        </div>

                        <div className="job-field">
                            <span className="field-label">{t('job.myJobs.statusLabel')}</span>
                            <span className={`field-value ${job.isClosed ? "closed" : "open"}`}>
                                {job.isClosed ? t('job.myJobs.status.closed') : t('job.myJobs.status.open')}
                            </span>
                        </div>

                        <div className="job-field">
                            <span className="field-label">{t('job.myJobs.applications')}</span>
                            <span className="field-value">
                                {job.applicationsCount}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyJobs;