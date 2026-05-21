import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBannerContent } from "../../utils/getBannerContent";
import { useTranslation } from "react-i18next";
import "./NewFeatureBanner.scss";

const NewFeatureBanner = ({ user }) => {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  if (!visible) return null;
  const { t } = useTranslation("banner");
  const content = getBannerContent(user);

  return (
    <div className="banner">
      <div className="banner-content">
        <div>
          <h3>{t(content.titleKey)}</h3>
          <p>{t(content.textKey)}</p>
        </div>

        <div className="banner-actions">
          <button onClick={() => navigate(content.link)}>
            {t(content.ctaKey)}
          </button>

          <span className="close" onClick={() => setVisible(false)}>
            ✕
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewFeatureBanner;