import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";
import { useTranslation } from 'react-i18next';

function Navbar() {
  const { t, i18n } = useTranslation();
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
  }, []);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <span className="text">{t('navbar.masterhub')}</span>
          </Link>
        </div>
        <div className="links">
          <Link className="link" to="/">
            <span>{t('navbar.home')}</span>
          </Link>
          <Link className="link" to="/">
            <span>{t('navbar.about')}</span>
          </Link>
          <Link className="link" to="/">
            <span>{t('navbar.categories')}</span>
          </Link>
          <button
            className="language-toggle"
            onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'uk' : 'en')}
          >
            {i18n.language === 'en' ? 'UA' : 'En'}
          </button>
          {!currentUser?.isSeller && <span>Become a Seller</span>}
          {currentUser ? (
            <div className="user" onClick={() => setOpen(!open)}>
              <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
              <span>{currentUser?.username}</span>
              {open && (
                <div className="options">
                  {currentUser.isSeller && (
                    <>
                      <Link className="link" to="/mygigs">
                        Gigs
                      </Link>
                      <Link className="link" to="/add">
                        Add New Gig
                      </Link>
                    </>
                  )}
                  <Link className="link" to="/profile">
                    {t('navbar.profile')}
                  </Link>
                  <Link className="link" to="/orders">
                    {t('navbar.orders')}
                  </Link>
                  <Link className="link" to="/messages">
                    {t('navbar.messages')}
                  </Link>
                  <Link className="link" onClick={handleLogout}>
                    {t('navbar.logout')}
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="link">Sign in</Link>
              <Link className="link" to="/register">
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
