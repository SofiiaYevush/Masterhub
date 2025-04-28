import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../../components/alert-message/AlertMessage";
import { useTranslation } from 'react-i18next';

function Login() {
  const { t } = useTranslation("login");
  const [showAlert, setShowAlert] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("/auth/login", { username, password });
      if (res.data.isAdmin) {
        localStorage.setItem("currentUser", JSON.stringify(res.data));
        navigate("/admin-dashboard");
        window.location.reload();
      } else {
        localStorage.setItem("currentUser", JSON.stringify(res.data));
        navigate("/");
      }    
    } catch (err) {
      console.error("Failed to login:", err);
      setShowAlert(true);
    }
  };

  return (
    <div className="sign-in">
      <form onSubmit={handleSubmit}>
        <h1 className="sign-in__title">{t('login.title')}</h1>
        <div className="form-title-field">
          <label className="form-title" htmlFor="">{t('login.username')}</label>
          <input
            className="form-field"
            name="username"
            type="text"
            placeholder={t('login.placeholderUsername')}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-title-field">
          <label className="form-title" htmlFor="">{t('login.password')}</label>
          <input
            className="form-field"
            name="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-submit-button">
          <button className="submit-white-button" type="submit">{t('login.submitBtn')}</button>
        </div>
        {error && error}
      </form>
      <div className="sign-in__devider"></div>
      <div className="sign-in__create-account container">
        <p>{t('login.firstTime')} <Link className="link" to="/pre-register"> <span>{t('login.createAccount')}</span></Link></p>
      </div>
      {showAlert && (
        <AlertMessage
          message={t('login.alertMessage')}
          duration={4000}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}

export default Login;
