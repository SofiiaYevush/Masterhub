import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import upload from "../../utils/upload";
import newRequest from "../../utils/newRequest";
import getCurrentUser from "../../utils/getCurrentUser";
import "./Profile.scss";
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation("profile");
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;

  const [form, setForm] = useState({});
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    enabled: !!userId,
    queryFn: () => newRequest.get(`/users/${userId}`).then(res => res.data),
    onSuccess: (data) => setForm(data)
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updatedData) =>
      newRequest.put(`/users/${userId}`, updatedData, { withCredentials: true }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["user", userId]);
      localStorage.setItem("currentUser", JSON.stringify(data.data));
      alert(t("profile.profileUpdated"));
    },    
    onError: () => alert(t("profile.errorUpdatingProfile")),
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (passwordData) =>
      newRequest.put(`/users/${userId}/password`, passwordData, { withCredentials: true }),
    onSuccess: () => {
      alert(t("profile.passwordUpdated"));
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (error) => {
      alert(error?.response?.data || t("profile.errorUpdatingProfile"));
    },
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    try {
      const uploadedUrl = await upload(file);
      setForm(prev => ({ ...prev, img: uploadedUrl }));
    } catch (err) {
      alert(t("profile.errorUploadingImage") || "Error uploading image");
    }
  };  

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (passwords.newPassword && passwords.newPassword !== passwords.confirmPassword) {
      alert(t("profile.passwordMismatch"));
      return;
    }

    updateProfileMutation.mutate(form);

    if (passwords.newPassword) {
      updatePasswordMutation.mutate(passwords);
    }
  };

  if (!currentUser || isLoading) return <div>Loading...</div>;

  return (
    <div className="profile">
      <form onSubmit={handleSubmit} className="profile-form">
      <div className="profile__form">
        <div className="profile__left">
          <div className="profile-photo-section">
            {form.img ? (
              <img src={form.img} alt="Profile" />
            ) : (
              <img src="/img/noavatar.jpg" alt="Profile" />
            )}
            <label htmlFor="file-upload" className="profile__white-button">
              {t("profile.selectPhotoBtn") || "Вибрати"}
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className="profile__right">
          <h1>{t("profile.profileTitle")}</h1>
          <div className="profile__right-labels-text">
            <label className="form-title" >{t("profile.username")}</label>
            <input
              className="form-field"
              type="text"
              name="username"
              value={form.username || ""}
              placeholder={t("profile.profileUsernamePlaceholder")}
              onChange={handleChange}
            />

            <label className="form-title" >{t("profile.email")}</label>
            <input
              className="form-field"
              type="email"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              placeholder={t("profile.profileEmailPlaceholder")}
            />

            <label className="form-title" >{t("profile.oldPassword")}</label>
            <div className="password-field">
              <input
                className="form-field password-input"
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                value={passwords.oldPassword}
                onChange={handlePasswordChange}
                placeholder={t("profile.enterOldPassword")}
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowOldPassword(prev => !prev)}
                aria-label="Toggle password visibility"
              >
                {showOldPassword ? <img src="../../icons/hide-pass.png" alt="Hide" /> : <img src="../../icons/show-pass.png" alt="Show" />}
            </button>
            </div>
          
            <label className="form-title" >{t("profile.newPassword")}</label>
            <div className="password-field">
              <input
                className="form-field password-input"
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                placeholder={t("profile.enterNewPassword")}
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowNewPassword(prev => !prev)}
                aria-label="Toggle new password visibility"
              >
                {showNewPassword ? <img src="../../icons/hide-pass.png" alt="Hide" /> : <img src="../../icons/show-pass.png" alt="Show" />}
              </button>
            </div>

            <label className="form-title" >{t("profile.confirmPassword")}</label>
            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-field password-input"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                placeholder={t("profile.confirmNewPassword")}
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowConfirmPassword(prev => !prev)}
                aria-label="Toggle new password visibility"
              >
                {showConfirmPassword ? <img src="../../icons/hide-pass.png" alt="Hide" /> : <img src="../../icons/show-pass.png" alt="Show" />}
              </button>
            </div>
            <label className="form-title" >{t("profile.country")}</label>
            <input className="form-field" type="text" name="country" value={form.country || ""} onChange={handleChange} />

            {currentUser.isSeller && (
              <>
                <label className="form-title" >{t("profile.phone")}</label>
                <input className="form-field" type="tel" name="phone" value={form.phone || ""} onChange={handleChange} />

                <label className="form-title" >{t("profile.desc")}</label>
                <textarea
                  className="form-field-description"
                  name="desc"
                  value={form.desc || ""}
                  onChange={handleChange}
                  cols="30"
                  rows="10"
                />
              </>
            )}
          </div>
          <button className="profile__submit-red-button" type="submit">{t("profile.save")}</button>
        </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
