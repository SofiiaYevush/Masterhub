import React from "react";
// import "./JobDetails.scss";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const JobDetails = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();

    // отримати job + applications
    const { data, isLoading, error } = useQuery({
        queryKey: ["job", id],
        queryFn: () => newRequest.get(`/jobs/${id}`).then(res => res.data),
    });

    // accept
    const acceptMutation = useMutation({
        mutationFn: (applicationId) =>
            newRequest.put(`/jobs/application/${applicationId}/accept`),
        onSuccess: () => {
            queryClient.invalidateQueries(["job", id]);
        },
    });

    // decline
    const declineMutation = useMutation({
        mutationFn: (applicationId) =>
            newRequest.put(`/jobs/application/${applicationId}/decline`),
        onSuccess: () => {
            queryClient.invalidateQueries(["job", id]);
        },
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading job</p>;

    const job = data;

    return (
        <div className="job-details">
            <div className="job-details__container">
                <div className="job-details__info">
                    <h1 className="job-title">{job.title}</h1>
                    <p className="job-desc">{job.desc}</p>
                    <div className="job-meta">
                        <span><b>Category:</b> {job.category}</span>
                        <span><b>Budget:</b> {job.budget || "-"} {job.isBudgetNegotiable && "(Negotiable)"}</span>
                        <span><b>Location:</b> {job.location || "-"}</span>
                        <span><b>Deadline:</b> {job.deadline ? new Date(job.deadline).toLocaleDateString() : "-"}</span>
                        <span><b>Status:</b> {job.status}</span>
                    </div>
                    <div className="job-skills">
                        <b>Skills:</b>
                        <div className="skills-list">
                            {job.skills?.map(skill => (
                                <span key={skill} className="skill-item">{skill}</span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="job-details__applications">
                    <h2>Applications</h2>

                    {job.applications?.length === 0 && <p>No applications yet</p>}

                    {job.applications?.map(app => (
                        <div key={app._id} className="application-card">

                            <div className="application-user">
                                <img src={app.taskerId?.img} alt="" />
                                <span>{app.taskerId?.username}</span>
                            </div>

                            <p className="application-cover">
                                {app.coverLetter || "No cover letter"}
                            </p>

                            <p><b>Proposed price:</b> {app.proposedPrice || "-"}</p>

                            <p className={`status ${app.status}`}>
                                Status: {app.status}
                            </p>
                            {job.status === "active" && app.status === "pending" && (
                                <div className="application-actions">
                                    <button
                                        className="accept-btn"
                                        onClick={() => acceptMutation.mutate(app._id)}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="decline-btn"
                                        onClick={() => declineMutation.mutate(app._id)}
                                    >
                                        Decline
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