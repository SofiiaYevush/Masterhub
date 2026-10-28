import React from 'react';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';

import { useTranslation } from 'react-i18next';

import './IdentityVerificationCard.scss';

const IdentityVerificationCard = ({ isVerified, onVerify }) => {
    const { t } = useTranslation('identity-verification');

    return (
        <div
            className={`identity-verification-card ${
                isVerified ? 'identity-verification-card--verified' : ''
            }`}
        >
            <div className="identity-verification-card__icon">
                {isVerified ? (
                    <CheckCircleRoundedIcon />
                ) : (
                    <SecurityRoundedIcon />
                )}
            </div>

            <div className="identity-verification-card__info">
                <span className="identity-verification-card__title">
                    {t('identityVerification.title')}
                </span>

                {isVerified ? (
                    <span className="identity-verification-card__verified">
                        <VerifiedUserOutlinedIcon />
                        {t('identityVerification.verified')}
                    </span>
                ) : (
                    <span className="identity-verification-card__not-verified">
                        {t('identityVerification.notVerified')}
                    </span>
                )}
            </div>

            {!isVerified && (
                <button
                    type="button"
                    className="identity-verification-card__button"
                    onClick={onVerify}
                >
                    <span>{t('identityVerification.verifyButton')}</span>
                    <ArrowForwardRoundedIcon />
                </button>
            )}
        </div>
    );
};

export default IdentityVerificationCard;