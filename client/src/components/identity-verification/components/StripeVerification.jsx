import React, { useState } from "react";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useTranslation } from "react-i18next";

import getCurrentUser from "../../../utils/getCurrentUser";

import "./StripeVerification.scss";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

const getStripeErrorMessage = (error, t) => {
  const errorMessages = {
    incomplete_number: "incompleteCard",
    invalid_number: "invalidCard",
    incomplete_expiry: "incompleteExpiry",
    invalid_expiry_month: "invalidExpiryMonth",
    invalid_expiry_year: "invalidExpiryYear",
    incomplete_cvc: "incompleteCvc",
    invalid_cvc: "invalidCvc",
    incorrect_cvc: "incorrectCvc",
    incomplete_zip: "incompleteZip",
    invalid_zip: "invalidZip",
    card_declined: "cardDeclined",
    expired_card: "expiredCard",
    insufficient_funds: "insufficientFunds",
    processing_error: "processingError",
  };

  const translationKey =
    errorMessages[error?.code] ||
    errorMessages[error?.decline_code];

  return translationKey
    ? t(`stripeVerification.errors.${translationKey}`)
    : t("stripeVerification.errors.genericError");
};

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true,
  iconStyle: "solid",
  style: {
    base: {
      color: "#292124",
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "15px",
      fontWeight: "400",
      "::placeholder": {
        color: "#aaa0a3",
      },
      iconColor: "#800000",
    },
    invalid: {
      color: "#b42318",
      iconColor: "#b42318",
    },
  },
};

const VerificationForm = ({ clientSecret, onSuccess, onClose }) => {
  const { t } = useTranslation("identity-verification");

  const user = getCurrentUser();

  const stripe = useStripe();
  const elements = useElements();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [cardError, setCardError] = useState("");
  const [isCardComplete, setIsCardComplete] = useState(false);

  const handleCardChange = (event) => {
    setIsCardComplete(event.complete);

    if (event.error) {
      setCardError(getStripeErrorMessage(event.error, t));
    } else {
      setCardError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || isSubmitting) {
      return;
    }

    setError("");

    if (!isCardComplete) {
      setCardError(
        t("stripeVerification.errors.incompleteCard")
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const cardElement = elements.getElement(CardElement);

      const { error: confirmError } =
        await stripe.confirmCardSetup(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              email: user?.email || undefined,
            },
          },
          return_url: `${window.location.origin}/profile`,
        });

      if (confirmError) {
        setError(getStripeErrorMessage(confirmError, t));
        return;
      }

      onSuccess();
    } catch {
      setError(
        t("stripeVerification.errors.genericError")
      );
    } finally {
      setIsSubmitting(false);
    }
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
          aria-label={t("stripeVerification.closeButton")}
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

        <p>{t("stripeVerification.description")}</p>
      </div>

      <div className="stripe-verification__payment">
        <label className="stripe-verification__card-label">
          {t("stripeVerification.cardNumber")}
        </label>

        <div className="stripe-verification__card-input">
          <CardElement
            options={CARD_ELEMENT_OPTIONS}
            onChange={handleCardChange}
          />
        </div>

        {cardError && (
          <p className="stripe-verification__field-error" role="alert">
            {cardError}
          </p>
        )}
      </div>

      {error && (
        <div className="stripe-verification__error" role="alert">
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
            {t("stripeVerification.verifying")}
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
        <p>{t("stripeVerification.secureNote")}</p>
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
    <Elements stripe={stripePromise}>
      <VerificationForm
        clientSecret={clientSecret}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </Elements>
  );
};

export default StripeVerification;
