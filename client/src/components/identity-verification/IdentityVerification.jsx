import React, { useEffect, useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import newRequest from "../../utils/newRequest";
import "./IdentityVerification.scss";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

const VerificationForm = ({ onSuccess, onClose }) => {
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
    <form onSubmit={handleSubmit} className="identity-verification">
      <div className="identity-verification__header">
        <h2>Verify your identity</h2>

        <button
          type="button"
          className="identity-verification__close"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <p className="identity-verification__description">
        Add a payment card to verify your account.
      </p>

      <div className="identity-verification__payment">
        <PaymentElement />
      </div>

      {error && (
        <div className="identity-verification__error">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="identity-verification__button"
        disabled={!stripe || !elements || isSubmitting}
      >
        {isSubmitting ? "Verifying..." : "Verify identity"}
      </button>
    </form>
  );
};

const IdentityVerification = ({ onClose, onVerified }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const createSetupIntent = async () => {
      try {
        const response = await newRequest.post(
          "/stripe/setup-intent"
        );

        setClientSecret(response.data.clientSecret);
      } catch (err) {
        setError(
          err?.response?.data ||
            "Unable to start identity verification."
        );
      }
    };

    createSetupIntent();
  }, []);

  if (error) {
    return (
      <div className="identity-verification">
        <div className="identity-verification__header">
          <h2>Verify your identity</h2>

          <button
            type="button"
            className="identity-verification__close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="identity-verification__error">
          {error}
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="identity-verification identity-verification--loading">
        Loading...
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
      }}
    >
      <VerificationForm
        onClose={onClose}
        onSuccess={onVerified}
      />
    </Elements>
  );
};

export default IdentityVerification;