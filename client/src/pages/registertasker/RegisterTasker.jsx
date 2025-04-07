import React, { useState } from "react";
import upload from "../../utils/upload";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import "./RegisterTasker.scss";
import { useTranslation } from 'react-i18next';

function RegisterTasker() {
    const { t } = useTranslation("register");
    const [file, setFile] = useState(null);
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        img: "",
        country: "",
        isSeller: true,
        desc: "",
        phone: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = await upload(file);
        try {
        await newRequest.post("/auth/register", {
            ...user,
            img: url,
        });
        navigate("/");
        } catch (err) {
        console.log(err);
        }
    };

    return (
        <div className="register">
            <form className="register-form" onSubmit={handleSubmit}>
                <h1 className="register__title">{t('register.titleTasker')}</h1>
                <div className="form-title-field profile-upload">
                    <label className="form-title picture" htmlFor="fileInput">
                        {t("register.profilePicture")}
                    </label>

                    <div
                        className="avatar-wrapper"
                        onClick={() => document.getElementById("fileInput").click()}
                    >
                        <img
                        src={file ? URL.createObjectURL(file) : "/img/default-avatar.png"}
                        alt="avatar preview"
                        className="avatar-preview"
                        />
                    </div>

                    <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        style={{ display: "none" }}
                    />

                    <span className="avatar-helper-text">
                        {t("register.chooseFileHint")}
                    </span>
                    </div>

                <div className="form-title-field">
                    <label className="form-title" htmlFor="">{t("register.userName")}</label>
                    <input
                        className="form-field"
                        name="username"
                        type="text"
                        placeholder={t("register.userNamePlaceholder")}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-title-field">
                    <label className="form-title" htmlFor="">{t("register.email")}</label>
                    <input
                        className="form-field"
                        name="email"
                        type="email"
                        placeholder="john.doe@gmail.com"
                        onChange={handleChange}
                    />
                </div>
                <div className="form-title-field">
                    <label className="form-title" htmlFor="">{t("register.password")}</label>
                    <input className="form-field" name="password" type="password" placeholder={t("register.passwordPlaceholder")} onChange={handleChange} />
                </div>
                <div className="form-title-field">
                    <label className="form-title" htmlFor="">{t("register.country")}</label>
                    <input
                        className="form-field"
                        name="country"
                        type="text"
                        placeholder={t("register.countryPlaceholder")}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-title-field">
                    <label className="form-title" htmlFor="">{t("register.phone")}</label>
                    <input
                        className="form-field"
                        name="phone"
                        type="text"
                        placeholder="+380 ХХ ХХХ ХХ ХХ"
                        onChange={handleChange}
                    />
                </div>
                <div className="form-title-field">
                    <label className="form-title" htmlFor="">{t("register.description")}</label>
                    <textarea
                        className="form-field-description"
                        placeholder={t("register.descriptionPlaceholder")}
                        name="desc"
                        id=""
                        cols="30"
                        rows="10"
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div className="form-submit-button">
                    <button className="submit-white-button" type="submit">{t('register.submitBtn')}</button>
                </div>
            </form>
        </div>
    );
}

export default RegisterTasker;
