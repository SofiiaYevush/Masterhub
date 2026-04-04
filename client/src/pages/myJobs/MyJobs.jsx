import React from "react";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
// import "./MyJobs.scss";

const MyJobs = () => {
    const navigate = useNavigate();

    const { data: jobs, isLoading, error } = useQuery({
        queryKey: ["myJobs"],
        queryFn: () => newRequest.get("/jobs/my-jobs").then(res => res.data),
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading jobs</p>;

    return (
        <div className="my-jobs">
            <h1>My Jobs</h1>
            <div className="jobs-list">
                {jobs?.map(job => (
                    <div key={job._id} className="job-card" onClick={() => navigate(`/jobs/${job._id}`)}>
                        <h2>{job.title}</h2>
                        <p>{job.desc.slice(0, 100)}...</p>
                        <p>Category: {job.category}</p>
                        <p>Budget: {job.budget} {job.isBudgetNegotiable ? "- Negotiable" : ""}</p>
                        <p>Location: {job.location}</p>
                        <p>Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : "-"}</p>
                        <p>Status: {job.isClosed ? "Closed" : "Open"}</p>
                        <p>Applications: {job.applications?.length || 0}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyJobs;