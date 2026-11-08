import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";
import { useTranslation } from 'react-i18next';
import UserAvatar from "../user-avatar/UserAvatar";

import {
  User,
  BriefcaseBusiness,
  ClipboardList,
  Plus,
  ShoppingBag,
  LogOut,
  FileText,
  ChevronDown,
} from "lucide-react";

function Navbar() {
  const { t, i18n } = useTranslation("navbar");
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

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
            <div className="navbar__logo-img">
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
              <div className="user" ref={dropdownRef}>
                <button
                  className={`user-trigger ${open ? "open" : ""}`}
                  onClick={() => setOpen(!open)}
                >
                  <UserAvatar
                    img={currentUser.img}
                    cardVerified={currentUser.cardVerified}
                    size={32}
                  />

                  <span className="username">{currentUser?.username}</span>

                  <ChevronDown className="dropdown-chevron" size={16} />
                </button>

                {open && (
                  <div className="options">
                    <div className="dropdown-header">
                      <span className="dropdown-user-name">
                        {currentUser?.username}
                      </span>
                      <span className="dropdown-user-role">
                        {currentUser.isSeller
                          ? t("navbar.sellerAccount")
                          : t("navbar.clientAccount")}
                      </span>
                    </div>

                    <div className="dropdown-divider" />

                    <Link className="dropdown-link" to="/profile" onClick={() => setOpen(false)}>
                      <User size={17} />
                      <span>{t("navbar.profile")}</span>
                    </Link>

                    {currentUser.isSeller ? (
                      <>
                        <Link className="dropdown-link" to="/my-applications" onClick={() => setOpen(false)}>
                          <FileText size={17} />
                          <span>{t("navbar.myApplications")}</span>
                        </Link>

                        <Link className="dropdown-link" to="/mygigs" onClick={() => setOpen(false)}>
                          <BriefcaseBusiness size={17} />
                          <span>{t("navbar.myServices")}</span>
                        </Link>

                        <Link className="dropdown-link" to="/add" onClick={() => setOpen(false)}>
                          <Plus size={17} />
                          <span>{t("navbar.addNew")}</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link className="dropdown-link" to="/my-jobs" onClick={() => setOpen(false)}>
                          <ClipboardList size={17} />
                          <span>{t("navbar.myJobs")}</span>
                        </Link>

                        <Link className="dropdown-link" to="/create-jobs" onClick={() => setOpen(false)}>
                          <Plus size={17} />
                          <span>{t("navbar.createJob")}</span>
                        </Link>
                      </>
                    )}

                    <Link className="dropdown-link" to="/orders" onClick={() => setOpen(false)}>
                      <ShoppingBag size={17} />
                      <span>{t("navbar.orders")}</span>
                    </Link>

                    <div className="dropdown-divider" />

                    <button className="dropdown-link logout-link" onClick={handleLogout}>
                      <LogOut size={17} />
                      <span>{t("navbar.logout")}</span>
                    </button>
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
