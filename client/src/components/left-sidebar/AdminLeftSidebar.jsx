import React from 'react';
import './LeftSidebar.scss';
import { useTranslation } from 'react-i18next';

function AdminLeftSidebar({ setActiveSection }) {
    const { t } = useTranslation("admin");
    return (
      <div className="admin-left-sidebar">
          <div className="admin-sidebar__header">
            <h2>{t('admin.masterhub')}</h2>
          </div>
          <ul className="admin-sidebar__settings-list">
            <li className="admin-sidebar__setting">
              <button onClick={() => setActiveSection('users')} className="sidebar-button">
                <img className="admin-sidebar__setting-img" src="../../icons/users.png" alt="" />
                {t('admin.users')}
                <img className="admin-sidebar__setting-img-arrow" src="../../icons/arrow-right.png" alt="" />
              </button>
              
            </li>
            <li className="admin-sidebar__setting">
              <button onClick={() => setActiveSection('gigs')} className="sidebar-button">
              <img className="admin-sidebar__setting-img" src="../../icons/checklist.png" alt="" />
                {t('admin.services')}
                <img className="admin-sidebar__setting-img-arrow" src="../../icons/arrow-right.png" alt="" />
              </button>
            </li>
          </ul>
      </div>
    );
}

export default AdminLeftSidebar;
