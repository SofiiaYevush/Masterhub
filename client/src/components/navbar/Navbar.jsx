import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";
import { useTranslation } from 'react-i18next';

function Navbar() {
  const { t, i18n } = useTranslation("navbar");
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const { pathname } = useLocation();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, [])

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="navbar-container">
        <div className="left-container">
          <div className="logo">
            <Link className="link" to="/">
              <span className="text">{t('navbar.masterhub')}</span>
            </Link>
            <div className="logo-img">
              <img src="../../icons/logo-white-big.png" alt="Logo" />
            </div>
          </div>
        </div>
        <div className="right-container">
          <div className="links">
            <Link className="link" to="/">
              <span>{t('navbar.home')}</span>
            </Link>
            <Link className="link" to="/about-us">
              <span>{t('navbar.about')}</span>
            </Link>
            <Link className="link" to="/categories">
              <span>{t('navbar.categories')}</span>
            </Link>

            {currentUser ? (
              <div className="user" onClick={() => setOpen(!open)}>
                <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
                <span>{currentUser?.username}</span>
                {open && (
                  <div className="options">
                    {currentUser.isSeller && (
                      <>
                        <Link className="dropdown-link" to="/mygigs">
                          {t('navbar.myServices')}
                        </Link>
                        <Link className="dropdown-link" to="/add">
                          {t('navbar.addNew')}
                        </Link>
                      </>
                    )}
                    <Link className="dropdown-link" to="/profile">
                      {t('navbar.profile')}
                    </Link>
                    <Link className="dropdown-link" to="/orders">
                      {t('navbar.orders')}
                    </Link>
                    <Link className="dropdown-link" onClick={handleLogout}>
                      {t('navbar.logout')}
                    </Link>
                  </div>
                )}
              </div>
              ) : (
                <>
                  <Link to="/login" className="link">
                    <button className="white-button-signIn">{t('navbar.signIn')}</button>
                  </Link>
                </>
              )}

            <button
              className="white-red-button"
              onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'uk' : 'en')}
            >
              {i18n.language === 'en' ? 'UA' : 'En'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
