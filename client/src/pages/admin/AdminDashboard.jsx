import React, { useState, useEffect } from "react";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import AllUsers from '../../components/all-users/AllUsers';
import AllGigs from '../../components/all-gigs/AllGigs';
import AdminLeftSidebar from '../../components/left-sidebar/AdminLeftSidebar';
import { useTranslation } from 'react-i18next';
import "./AdminDashboard.scss";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [gigs, setGigs] = useState([]);
    const [activeSection, setActiveSection] = useState('users');
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const { t, i18n } = useTranslation("admin");

    useEffect(() => {
        if (!currentUser?.isAdmin) {
        navigate("/");
        return;
        }

        const fetchData = async () => {
            try {
                if (activeSection === 'users') {
                const usersRes = await newRequest.get("/admin/users");
                setUsers(usersRes.data);
                } else if (activeSection === 'gigs') {
                const gigsRes = await newRequest.get("/gigs");
                setGigs(gigsRes.data);
                }
            } catch (err) {
                console.error("Failed to fetch admin data:", err);
            }
        };

        fetchData();
    }, [currentUser, activeSection, navigate]);

    const handleBlockUser = async (id) => {
        try {
        await newRequest.patch(`/admin/users/${id}/block`);
        setUsers((prev) =>
            prev.map((u) =>
            u._id === id ? { ...u, isBlocked: !u.isBlocked } : u
            )
        );
        } catch (err) {
        console.error("Failed to block user:", err);
        }
    };

    // const handleDeleteGig = async (id) => {
    //     try {
    //     await newRequest.delete(`/admin/gigs/${id}`);
    //     setGigs((prev) => prev.filter((g) => g._id !== id));
    //     } catch (err) {
    //     console.error("Failed to delete gig:", err);
    //     }
    // };

    const handleDeleteGig = async (id) => {
        try {
            await newRequest.delete(`/admin/gigs/${id}`);
            setGigs((prev) =>
                prev.map((gig) =>
                gig._id === id ? { ...gig, isDeleted: true } : gig
                )
            );
        } catch (err) {
            console.error("Failed to delete gig:", err);
        }
    };
      

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        navigate("/");
        window.location.reload();
    };

    const renderContent = () => {
        if (activeSection === 'users') {
        return (
            <AllUsers
            users={users}
            handleBlockUser={handleBlockUser}
            />
        );
        } else if (activeSection === 'gigs') {
        return (
            <AllGigs
            gigs={gigs}
            handleDeleteGig={handleDeleteGig}
            />
        );
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard__left">
                <AdminLeftSidebar setActiveSection={setActiveSection} />
            </div>
            <div className="admin-dashboard__right">
                <div className="admin-dashboard__right-top-section">
                    <div className="admin-dashboard__title">
                        <h1>{t('admin.admin-dashboard')}</h1>
                    </div>
                    <div className="admin-dashboard__avatar-translation">
                        <div className="user">
                            <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
                            <span>{currentUser?.username}</span>
                        </div>
                        <div className="admin-dashboard__buttons">
                            <button onClick={handleLogout} className="admin-dashboard__red-button">{t('admin.logout')}</button>
                            <button
                                className="admin-dashboard__white-button"
                                onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'uk' : 'en')}
                                >
                                {i18n.language === 'en' ? 'UA' : 'En'}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="admin-dashboard__right-bottom-section">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
