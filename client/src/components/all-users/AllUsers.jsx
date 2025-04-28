import React from 'react';
import './AllUsers.scss';
import { useTranslation } from 'react-i18next';

function AllUsers({ users, handleBlockUser }) {
    const { t } = useTranslation("admin");

    return (
        <div className="all-users">
          <h2>{t('admin.usersTitle')}</h2>
          <table className="all-users__table">
            <thead>
              <tr>
                <th>{t('admin.photo')}</th>
                <th>{t('admin.username')}</th>
                <th>{t('admin.phone')}</th>
                <th>{t('admin.email')}</th>
                <th>{t('admin.type')}</th>
                <th>{t('admin.registeredAt')}</th>
                <th>{t('admin.status')}</th>
                <th>{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <img
                      src={user.img || "/img/noavatar.jpg"}
                      alt={user.username}
                      className="all-users__avatar"
                    />
                  </td>
                  <td>{user.username}</td>
                  <td>{user.phone || '—'}</td>
                  <td>{user.email}</td>
                  <td>
                    {
                        user.isSeller ? 
                        <p>{t('admin.tasker')}</p> :
                        <p>{t('admin.client')}</p>
                    }
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                    {
                        user.isBlocked ?
                        <p className="blocked-field">{t('admin.blocked')}</p> :
                        <p className="active-field">{t('admin.active')}</p>
                    }
                </td>
                  <td>
                    <button
                      className={`all-users__block-btn ${user.isBlocked ? 'unblock' : 'block'}`}
                      onClick={() => handleBlockUser(user._id)}
                    >
                      {user.isBlocked ? t('admin.unblock-btn') : t('admin.block-btn')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    );
}

export default AllUsers;
