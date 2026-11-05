import React, { useState } from "react";

import newRequest from "../../utils/newRequest";
import VerificationWelcome from "./components/VerificationWelcome";
import StripeVerification from "./components/StripeVerification";
import refreshCurrentUser from "../../utils/refreshCurrentUser";

import "./IdentityVerification.scss";

const IdentityVerification = ({ onClose, onVerified }) => {
  const [step, setStep] = useState("welcome");
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await newRequest.post("/stripe/setup-intent");

      setClientSecret(response.data.clientSecret);
      setStep("stripe");
    } catch (err) {
      setError(
        err?.response?.data ||
        "Unable to start identity verification."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = async () => {
    await refreshCurrentUser();
    onVerified();
  };

  const handleBack = () => {
    setStep("welcome");
    setError("");
  };

  return (
    <div className="identity-modal-overlay">
      {step === "welcome" && (
        <VerificationWelcome
          onContinue={handleContinue}
          onClose={onClose}
          isLoading={isLoading}
          error={error}
        />
      )}

      {step === "stripe" && clientSecret && (
        <StripeVerification
          clientSecret={clientSecret}
          onClose={handleBack}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default IdentityVerification;