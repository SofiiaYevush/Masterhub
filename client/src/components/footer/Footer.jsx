import React from "react";
import { Link } from "react-router-dom";
import "./Footer.scss";
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation("footer");
  return (
    <div className="footer">
      <div className="container">
        <div className="top">
          <div className="left">
            <Link className="link" to="/">
              <span className="text">{t('footer.masterhub')}</span>
            </Link>
          </div>
          <div className="right">
            <Link className="link" to="/">
              <span>{t('footer.home')}</span>
            </Link>
            <Link className="link" to="/">
              <span>{t('footer.about')}</span>
            </Link>
            <Link className="link" to="/">
              <span>{t('footer.categories')}</span>
            </Link>
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <div className="item">
              <span>{t('footer.createdBy')}</span>
              <span>{t('footer.SofiiaYevush')}</span>
            </div>
          </div>
          <div className="right">
            <div className="item">
              <span>{t('footer.uniFirst')}</span>
              <span>{t('footer.uniSecond')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
