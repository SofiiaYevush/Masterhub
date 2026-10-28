import React, { useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { useTranslation } from 'react-i18next';

import "./StripeVerification.scss";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

const VerificationForm = ({ onSuccess, onClose }) => {
  const { t } = useTranslation('identity-verification');

  const stripe = useStripe();
  const elements = useElements();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setError(submitError.message);
      setIsSubmitting(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/profile`,
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message);
      setIsSubmitting(false);
      return;
    }

    onSuccess();
    setIsSubmitting(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="stripe-verification"
    >
      <div className="stripe-verification__header">
        <button
          type="button"
          className="stripe-verification__back"
          onClick={onClose}
        >
          <span>←</span>
          {t("stripeVerification.backButton")}
        </button>

        <button
          type="button"
          className="stripe-verification__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="stripe-verification__intro">
        <div className="stripe-verification__badge">
          <span>✓</span>
          {t("stripeVerification.secureVerification")}
        </div>

        <h2>{t("stripeVerification.title")}</h2>

        <p>
          {t("stripeVerification.description")}
        </p>
      </div>

      <div className="stripe-verification__payment">
        <PaymentElement />
      </div>

      {error && (
        <div className="stripe-verification__error">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="stripe-verification__button"
        disabled={!stripe || !elements || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="stripe-verification__spinner" />
            Verifying...
          </>
        ) : (
          <>
            {t("stripeVerification.verifyButton")}
            <span>✓</span>
          </>
        )}
      </button>

      <div className="stripe-verification__secure-note">
        <span>🔒</span>

        <p>
          {t("stripeVerification.secureNote")}
        </p>
      </div>
    </form>
  );
};

const StripeVerification = ({
  clientSecret,
  onClose,
  onSuccess,
}) => {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        locale: "auto",
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#800000",
            colorBackground: "#ffffff",
            colorText: "#262626",
            borderRadius: "10px",
          },
        },
      }}
    >
      <VerificationForm
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </Elements>
  );
};

export default StripeVerification;