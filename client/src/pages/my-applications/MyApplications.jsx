//FOR Tasker

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useTranslation } from 'react-i18next';
import "./MyApplications.scss";
import { categories } from "../../data";

const tabs = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Accepted", value: "accepted" },
    { label: "Rejected", value: "rejected" },
    { label: "Withdrawn", value: "withdrawn" },
];

const MyApplications = () => {
    const [activeTab, setActiveTab] = useState("");
    const { t } = useTranslation("application");
  const categoriesList = categories();

    const { data, isLoading, error } = useQuery({
        queryKey: ["myApplications", activeTab],
        queryFn: () =>
            newRequest
                .get(`/applications/my-applications${activeTab ? `?status=${activeTab}` : ""}`)
                .then((res) => res.data),
    });
    const queryClient = useQueryClient();

    const withdrawMutation = useMutation({
        mutationFn: (id) =>
            newRequest.put(`/applications/${id}/withdraw`),
        onSuccess: () => {
            queryClient.invalidateQueries(["myApplications"]);
        },
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading applications</p>;

    return (
        <div className="my-applications">
            <h1 className="my-applications__page-title">{t("application.myApplications.pageTitle")}</h1>
            <div className="tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        className={activeTab === tab.value ? "active" : ""}
                        onClick={() => setActiveTab(tab.value)}
                    >
                        {tab.value
                            ? t(`application.myApplications.tab.${tab.value}`)
                            : t("application.myApplications.tab.all")}
                    </button>
                ))}
            </div>
            <div className="applications-list">
                {data?.length === 0 && <p>{t("application.myApplications.noApplications")}</p>}
                {data?.map((app) => (
                    <div key={app._id} className="application-card">
                        <h2>{app.jobId?.title}</h2>
                        <div className="application-divider"></div>
                        <p className="meta">
                            <span className="meta__label">
                                {t("application.myApplications.category")}:
                            </span>
                            <span className="meta__value">
                                {
                                    categoriesList.find(cat => cat.key === app.jobId?.category)?.title
                                    || app.jobId?.category
                                }
                            </span>
                        </p>

                        <p className="meta">
                            <span className="meta__label">
                                {t("application.myApplications.location")}:
                            </span>
                            <span className="meta__value">
                                {app.jobId?.location || t("application.myApplications.locationRemote")}
                            </span>
                        </p>

                        <p className="meta">
                            <span className="meta__label">
                                {t("application.myApplications.proposedPrice")}:
                            </span>
                            <span className="meta__value">
                                {app.proposedPrice || app.jobId?.budget}
                            </span>
                        </p>

                        <p className="meta">
                            <span className="meta__label">
                                {t("application.myApplications.deadline")}:
                            </span>
                            <span className="meta__value">
                                 {new Date(app.jobId?.deadline).toLocaleDateString("uk-UA")}
                            </span>
                        </p>
                        <p className={`status ${app.status}`}>
                            {t("application.myApplications.statusLabel")}: {t(`application.myApplications.statuses.${app.status}`)}
                        </p>
                        {app.status === "pending" && (
                            <button
                                className="withdraw-btn"
                                onClick={() => withdrawMutation.mutate(app._id)}
                            >
                                {t("application.myApplications.withdrawBtn")}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyApplications;