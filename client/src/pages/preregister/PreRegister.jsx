import React from "react";
import { Link } from "react-router-dom";
import "./PreRegister.scss";
import { useTranslation } from 'react-i18next';

function PreRegister() {
  const { t } = useTranslation("pre-register");

    return ( 
        <div className="sign-up container">
            <div className="sign-up__title">
                <h1>{t('pre-register.createAccount')}</h1>
            </div>
            <div className="sign-up__text">
                <p>{t('pre-register.haveAccount')}<Link className="link" to="/login"> <span>{t('pre-register.signIn')}</span></Link></p>
            </div>
            <div className="sign-up__buttons">
                <div className="sign-up__become-tasker">
                    <Link to="/register-tasker" className="link">
                        <button className="red-button-pre-register">{t('pre-register.becomeATasker')}</button>
                    </Link>
                </div>
                <div className="sign-up__become-client">
                    <Link to="/register-client" className="link">
                        <button className="white-button-pre-register">{t('pre-register.becomeAClient')}</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PreRegister;
