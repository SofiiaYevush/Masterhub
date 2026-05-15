import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useTranslation } from 'react-i18next';
import "./JobDetails.scss";

const JobDetails = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("all");
    const { t } = useTranslation("job");

    // отримати job + applications
    const { data, isLoading, error } = useQuery({
        queryKey: ["job", id],
        queryFn: () => newRequest.get(`/jobs/${id}/applications`).then(res => res.data),
    });

    // accept
    const acceptMutation = useMutation({
        mutationFn: (applicationId) =>
            newRequest.put(`/applications/${applicationId}/accept`),
        onSuccess: () => {
            queryClient.invalidateQueries(["job", id]);
        },
    });

    // decline
    const declineMutation = useMutation({
        mutationFn: (applicationId) =>
            newRequest.put(`/applications/${applicationId}/decline`),
        onSuccess: () => {
            queryClient.invalidateQueries(["job", id]);
        },
    });

    const job = data;

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading job</p>;

    const filteredApplications = job.applications?.filter(app => {
        if (activeTab === "all") return true;
        if (activeTab === "pending") return app.status === "pending";
        if (activeTab === "accepted") return app.status === "accepted";
        if (activeTab === "rejected") return app.status === "rejected";
        if (activeTab === "withdrawn") return app.status === "withdrawn";
        return true;
    });

    return (
        <div className="job-details">
            <div className="job-details__container">

                {/* LEFT */}
                <div className="job-details__info">
                    <h1 className="job-title">{job.title}</h1>

                    <p className="job-desc">{job.desc}</p>

                    <div className="job-meta">

                        <div className="job-field">
                            <span className="job-label">{t('job.jobDetails.category')}</span>
                            <span className="job-value">{job.category}</span>
                        </div>

                        <div className="job-field">
                            <span className="job-label">{t('job.jobDetails.budget')}</span>
                            <span className="job-value">
                                {job.budget}{" "}
                                {job.isBudgetNegotiable && <span className="muted">{t('job.jobDetails.budgetNegotiable')}</span>}
                            </span>
                        </div>

                        <div className="job-field">
                            <span className="job-label">{t('job.jobDetails.location')}</span>
                            <span className="job-value">{job.location || "-"}</span>
                        </div>

                        <div className="job-field">
                            <span className="job-label">{t('job.jobDetails.deadline')}</span>
                            <span className="job-value">
                                {job.deadline ? new Date(job.deadline).toLocaleDateString() : "-"}
                            </span>
                        </div>

                        <div className="job-field">
                            <span className="job-label">{t('job.jobDetails.statusLabel')}</span>
                            <span className={`job-value status ${job.status}`}>
                                {t(`job.jobDetails.statuses.${job.status}`)}
                            </span>
                        </div>

                        <div className="job-field skills-field">
                            <span className="job-label">
                                {t('job.jobDetails.skills')}
                            </span>

                            <div className="skills-list">
                                {job.skills?.map(skill => (
                                    <div key={skill} className="skill-item">
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="job-details__applications">
                    <h2 className="applications-title">{t('job.jobDetails.applicationsTitle')}</h2>

                    <div className="tabs">
                        <button className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>
                            {t('job.jobDetails.tabs.all')}
                        </button>
                        <button className={activeTab === "pending" ? "active" : ""} onClick={() => setActiveTab("pending")}>
                            {t('job.jobDetails.tabs.pending')}
                        </button>
                        <button className={activeTab === "accepted" ? "active" : ""} onClick={() => setActiveTab("accepted")}>
                            {t('job.jobDetails.tabs.accepted')}
                        </button>
                        <button className={activeTab === "rejected" ? "active" : ""} onClick={() => setActiveTab("rejected")}>
                            {t('job.jobDetails.tabs.rejected')}
                        </button>
                        <button className={activeTab === "withdrawn" ? "active" : ""} onClick={() => setActiveTab("withdrawn")}>
                            {t('job.jobDetails.tabs.withdrawn')}
                        </button>
                    </div>

                    {job.applications?.length === 0 && (
                        <p className="empty-state">{t('job.jobDetails.emptyState')}</p>
                    )}

                    {filteredApplications?.map(app => (
                        <div key={app._id} className="application-card">

                            <div className="application-user">
                                <img src={app.taskerId?.img} alt="" />
                                <div>
                                    <span className="username">{app.taskerId?.username}</span>
                                    <span className={`status-pill ${app.status}`}>
                                        {t(`job.jobDetails.tabs.${app.status}`)}
                                    </span>
                                </div>
                            </div>

                            <p className="application-cover">
                                {app.coverLetter || t('job.jobDetails.noCoverLetter')}
                            </p>

                            <p className="price">
                                {t('job.jobDetails.proposedPrice')} <b>{app.proposedPrice || "-"}</b>
                            </p>

                            {job.status === "active" && app.status === "pending" && (
                                <div className="application-actions">
                                    <button className="accept-btn" onClick={() => acceptMutation.mutate(app._id)}>
                                        {t('job.jobDetails.accept')}
                                    </button>
                                    <button className="decline-btn" onClick={() => declineMutation.mutate(app._id)}>
                                        {t('job.jobDetails.decline')}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default JobDetails;