import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { useTranslation } from 'react-i18next';
import "./JobDetailsTasker.scss";

const JobDetailsTasker = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [coverLetter, setCoverLetter] = useState("");
    const [proposedPrice, setProposedPrice] = useState("");
    const { t } = useTranslation("job");

    // деталі job
    const { data: job, isLoading, error } = useQuery({
        queryKey: ["job", id],
        queryFn: () => newRequest.get(`/jobs/${id}/tasker`).then((res) => res.data),
    });

    // Мутація для аплаю
    const mutation = useMutation({
        mutationFn: (payload) => newRequest.post(`/jobs/${id}/apply`, payload),
        onSuccess: () => {
            queryClient.invalidateQueries(["job", id]);
            alert("Applied successfully!");
        },
    });

    const handleApply = () => {
        mutation.mutate({ coverLetter, proposedPrice });
    };

    if (isLoading) return <p>Loading job...</p>;
    if (error) return <p>Failed to load job</p>;

    return (
        <div className="job-details-tasker">
            <div className="container">
                {/* LEFT */}
                <div className="job-card">
                    <div className="title-row">
                        <h1>{job.title}</h1>
                        <span className={`status ${job.status}`}>
                            {job.status}
                        </span>
                    </div>
                    <div className="desc">
                        {job.desc}
                    </div>
                    <div className="info-grid">
                        <div className="info">
                            <span className="label">{t("job.jobDetailsTasker.category")}</span>
                            <span className="value">{job.category}</span>
                        </div>

                        <div className="info">
                            <span className="label">{t("job.jobDetailsTasker.budget")}</span>
                            <span className="value">
                                {job.budget}{" "}
                                {job.isBudgetNegotiable && (
                                    <span style={{ color: "#9ca3af", fontWeight: 600 }}>
                                        {t("job.jobDetailsTasker.budgetNegotiable")}
                                    </span>
                                )}
                            </span>
                        </div>

                        <div className="info">
                            <span className="label">{t("job.jobDetailsTasker.location")}</span>
                            <span className="value">{job.location || "-"}</span>
                        </div>

                        <div className="info">
                            <span className="label">{t("job.jobDetailsTasker.status")}</span>
                            <span className="value">{t(`job.jobDetailsTasker.statuses.${job.status}`)}</span>
                        </div>

                        <div className="info">
                            <span className="label">{t('job.jobDetails.deadline')}</span>
                            <span className="value">
                                {job.deadline ? new Date(job.deadline).toLocaleDateString() : "-"}
                            </span>
                        </div>

                        <div className="info">
                            <span className="job-label">
                                {t("job.jobDetails.skills")}
                            </span>

                            <div className="skills-list">
                                {job.skills?.map((skill, index) => (
                                    <span
                                        key={skill}
                                        className="skill-item"
                                        style={{ "--i": index }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="apply-card">

                    <div className="apply-title">
                        {t("job.jobDetailsTasker.applyTitle")}
                    </div>

                    <div className="apply-sub">
                        {t("job.jobDetailsTasker.applySub")}
                    </div>
                    <div className="apply-sub2">
                        {t("job.jobDetailsTasker.applySub2")}
                    </div>

                    {job.alreadyApplied ? (
                        <div className="disabled">
                            {t("job.jobDetailsTasker.alreadyApplied")}
                        </div>
                    ) : (
                        <div className="form">
                            <textarea
                                placeholder={t("job.jobDetailsTasker.coverLetterPlaceholder")}
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder={t("job.jobDetailsTasker.proposedPricePlaceholder")}
                                value={proposedPrice}
                                onChange={(e) => setProposedPrice(e.target.value)}
                            />
                            <button
                                className="btn"
                                onClick={handleApply}
                            >
                                {t("job.jobDetailsTasker.applyButton")}
                            </button>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetailsTasker;