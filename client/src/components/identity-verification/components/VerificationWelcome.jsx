import React from "react";
import { useTranslation } from 'react-i18next';

import "./VerificationWelcome.scss";

const VerificationWelcome = ({
  onContinue,
  onClose,
  isLoading,
  error,
}) => {
const { t } = useTranslation('identity-verification');

  return (
    <div className="verification-welcome">
      <button
        type="button"
        className="verification-welcome__close"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>

      <div className="verification-welcome__visual">
        <div className="verification-welcome__glow" />

        <div className="verification-welcome__wave verification-welcome__wave--one" />
        <div className="verification-welcome__wave verification-welcome__wave--two" />

        <div className="verification-welcome__shield">
          <svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M60 9L99 24V54C99 80.5 82.5 103.5 60 111C37.5 103.5 21 80.5 21 54V24L60 9Z"
              fill="white"
              fillOpacity="0.96"
            />

            <path
              d="M60 28L83 37V54C83 70.5 73.5 85.5 60 91C46.5 85.5 37 70.5 37 54V37L60 28Z"
              fill="currentColor"
              fillOpacity="0.12"
            />

            <path
              d="M47 59L56 68L75 48"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="verification-welcome__floating-card verification-welcome__floating-card--top">
          <span className="verification-welcome__floating-icon">
            ✓
          </span>

          <div>
            <strong>{t("identityVerificationWelcome.identity")}</strong>
            <span>{t("identityVerificationWelcome.protected")}</span>
          </div>
        </div>

        <div className="verification-welcome__floating-card verification-welcome__floating-card--bottom">
          <span className="verification-welcome__lock">🔒</span>
          <span>{t("identityVerificationWelcome.stripeSecured")}</span>
        </div>
      </div>

      <div className="verification-welcome__content">
        <div className="verification-welcome__badge">
          <span className="verification-welcome__badge-dot" />
          {t("identityVerificationWelcome.badge")}
        </div>

        <h2>{t("identityVerificationWelcome.title")}</h2>

        <p className="verification-welcome__description">
          {t("identityVerificationWelcome.description")}
        </p>

        <div className="verification-welcome__benefits">
          <div className="verification-welcome__benefit">
            <span className="verification-welcome__benefit-icon">
              ✓
            </span>

            <div>
              <strong>{t("identityVerificationWelcome.benefitFirstTitle")}</strong>

              <span>
                {t("identityVerificationWelcome.benefitFirstDescription")}
              </span>
            </div>
          </div>

          <div className="verification-welcome__benefit">
            <span className="verification-welcome__benefit-icon">
              🔒
            </span>

            <div>
              <strong>{t("identityVerificationWelcome.benefitSecondTitle")}</strong>

              <span>
                {t("identityVerificationWelcome.benefitSecondDescription")}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="verification-welcome__error">
            {error}
          </div>
        )}

        <div className="verification-welcome__actions">
          <button
            type="button"
            className="verification-welcome__continue"
            onClick={onContinue}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="verification-welcome__spinner" />
                {t("identityVerificationWelcome.preparing")}
              </>
            ) : (
              <>
                {t("identityVerificationWelcome.continueButton")}
                <span>→</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="verification-welcome__skip"
            onClick={onClose}
          >
            {t("identityVerificationWelcome.skipButton")}
          </button>
        </div>

        <p className="verification-welcome__privacy">
          {t("identityVerificationWelcome.privacy")}
        </p>
      </div>
    </div>
  );
};

export default VerificationWelcome;