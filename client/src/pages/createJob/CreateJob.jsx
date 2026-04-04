import React, { useReducer, useState } from "react";
// import "./CreateJob.scss";
import { categories } from "../../data";
import { jobReducer, INITIAL_STATE } from "../../reducers/jobReducer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../../components/alert-message/AlertMessage";
import { useTranslation } from 'react-i18next';

const CreateJob = () => {
    const { t } = useTranslation("job");
    const [showAlert, setShowAlert] = useState(false);
    const [state, dispatch] = useReducer(jobReducer, INITIAL_STATE);
    const [isBudgetNegotiable, setIsBudgetNegotiable] = useState(false);

    const handleChange = (e) => {
        dispatch({ type: "CHANGE_INPUT", payload: { name: e.target.name, value: e.target.value } });
    };

    const handleSkills = (e) => {
        e.preventDefault();
        dispatch({ type: "ADD_SKILL", payload: e.target[0].value });
        e.target[0].value = "";
    };

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (job) => newRequest.post("/jobs", job),
        onSuccess: () => {
            queryClient.invalidateQueries(["myJobs"]);
            navigate("/my-jobs");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(state);
        setShowAlert(true);
    };

    const categoriesList = categories();

    return (
        <div className="create-job">
            <h1>{t('job.createJob.title')}</h1>
            <div className="job-form">
                <div className="job-main-fields">
                    <div className="field">
                        <label>{t('job.createJob.titleField')} *</label>
                        <input type="text" name="title" onChange={handleChange} placeholder={t('job.createJob.titlePlaceholder')} />
                    </div>

                    <div className="field">
                        <label>{t('job.createJob.description')} *</label>
                        <textarea name="desc" rows="6" onChange={handleChange} placeholder={t('job.createJob.descPlaceholder')} />
                    </div>

                    <div className="field">
                        <label>{t('job.createJob.categoryLabel')} *</label>
                        <select name="category" onChange={handleChange}>
                            <option value="" disabled selected>{t('job.createJob.selectCategory')}</option>
                            {categoriesList.map(cat => <option key={cat.key} value={cat.key}>{cat.title}</option>)}
                        </select>
                    </div>

                    <div className="field">
                        <label>{t('job.createJob.budgetLabel')}</label>
                        <input type="number" name="budget" onChange={handleChange} disabled={isBudgetNegotiable} />
                        <label>
                            <input type="checkbox" checked={isBudgetNegotiable} onChange={e => {
                                setIsBudgetNegotiable(e.target.checked);
                                dispatch({ type: "CHANGE_INPUT", payload: { name: "isBudgetNegotiable", value: e.target.checked } });
                                if (e.target.checked) dispatch({ type: "CHANGE_INPUT", payload: { name: "budget", value: null } });
                            }} />
                            {t('job.createJob.budgetNegotiable')}
                        </label>
                    </div>

                    <div className="field">
                        <label>{t('job.createJob.location')}</label>
                        <input type="text" name="location" onChange={handleChange} />
                    </div>

                    <div className="field">
                        <label>{t('job.createJob.deadline')}</label>
                        <input type="date" name="deadline" onChange={handleChange} />
                    </div>

                    <div className="field">
                        <label>{t('job.createJob.skills')}</label>
                        <form onSubmit={handleSkills}>
                            <input type="text" placeholder={t('job.createJob.skillsPlaceholder')} />
                            <button type="submit">{t('job.createJob.addSkill')}</button>
                        </form>
                        <div className="skills-list">
                            {state.skills?.map(skill => (
                                <span key={skill} className="skill-item">{skill} <button onClick={() => dispatch({ type: "REMOVE_SKILL", payload: skill })}>X</button></span>
                            ))}
                        </div>
                    </div>

                    <div className="field">
                        <label>{t('job.createJob.language')} *</label>
                        <label>
                            <input type="radio" name="language" checked={state.languageVisibility.uk} onChange={() => dispatch({ type: "TOGGLE_LANGUAGE_VISIBILITY", payload: { language: "uk" } })} />
                            {t('job.createJob.ukrainian')}
                        </label>
                        <label>
                            <input type="radio" name="language" checked={state.languageVisibility.en} onChange={() => dispatch({ type: "TOGGLE_LANGUAGE_VISIBILITY", payload: { language: "en" } })} />
                            {t('job.createJob.english')}
                        </label>
                    </div>

                </div>
                <button onClick={handleSubmit}>{t('job.createJob.createBtn')}</button>
            </div>

            {showAlert && <AlertMessage message={t('job.createJob.alertMessage')} duration={4000} onClose={() => setShowAlert(false)} />}
        </div>
    );
};

export default CreateJob;