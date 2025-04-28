import React from "react";
import { Link } from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useTranslation } from 'react-i18next';

function MyGigs() {
  const { t } = useTranslation("my-gigs");

  const currentUser = getCurrentUser();

  const queryClient = useQueryClient();

  const userId = currentUser?._id;

  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs", userId],
    enabled: !!userId,
    queryFn: () => {
      return newRequest.get(`/gigs?userId=${userId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          throw err;
        });
    },
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`/gigs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  return (
    <div className="myGigs">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="myGigs-container">
          <div className="title">
            <h1>{t('my-gigs.myGigs')}</h1>
            {currentUser.isSeller && (
              <Link to="/add">
                <button className="white-button-myGigs">{t('my-gigs.add')}</button>
              </Link>
            )}
          </div>
          <div className="myGigs-table">
            <table>
              <tr>
                <th>{t('my-gigs.img')}</th>
                <th>{t('my-gigs.title')}</th>
                <th>₴ {t('my-gigs.price')}</th>
                <th>{t('my-gigs.date')}</th>
                <th>{t('my-gigs.action')}</th>
              </tr>
              {data.map((gig) => (
                <tr key={gig._id}>
                  <td>
                    <img className="image" src={gig.cover} alt="" />
                  </td>
                  <td className="gig-title">{gig.title}</td>
                  <td>{gig.price}</td>
                  <td>{new Date(gig.createdAt).toLocaleDateString()}</td>
                  <td>
                    <img
                      className="delete"
                      src="./img/delete.png"
                      alt=""
                      onClick={() => handleDelete(gig._id)}
                    />
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyGigs;
