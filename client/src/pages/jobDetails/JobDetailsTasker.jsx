import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";

const JobDetailsTasker = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [coverLetter, setCoverLetter] = useState("");
    const [proposedPrice, setProposedPrice] = useState("");

    // деталі job
    const { data: job, isLoading, error } = useQuery({
        queryKey: ["job", id],
        queryFn: () => newRequest.get(`/jobs/${id}`).then((res) => res.data),
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
            <h1>{job.title}</h1>
            <p>{job.desc}</p>
            <p>Category: {job.category}</p>
            <p>Budget: {job.budget} {job.isBudgetNegotiable && "(Negotiable)"}</p>
            <p>Location: {job.location || "Remote"}</p>
            <p>Status: {job.status}</p>

            {job.alreadyApplied ? (
                <button disabled>Already Applied</button>
            ) : (
                <div className="apply-section">
                    <textarea
                        placeholder="Cover Letter"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Proposed Price"
                        value={proposedPrice}
                        onChange={(e) => setProposedPrice(e.target.value)}
                    />
                    <button onClick={handleApply}>Apply</button>
                </div>
            )}
        </div>
    );
};

export default JobDetailsTasker;