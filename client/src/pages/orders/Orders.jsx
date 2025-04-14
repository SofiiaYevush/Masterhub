import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import getCurrentUser from "../../utils/getCurrentUser";
import "./Orders.scss";

const Orders = () => {
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () => newRequest.get("/orders").then(res => res.data),
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => newRequest.delete(`/orders/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["orders"]),
  });

  const completeMutation = useMutation({
    mutationFn: (id) =>
      newRequest.put(`/orders/${id}/complete`),
    onSuccess: () => queryClient.invalidateQueries(["orders"]),
  });

  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      cancelMutation.mutate(id);
    }
  };

  const handleComplete = (id) => {
    if (window.confirm("Mark this order as complete?")) {
      completeMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading orders.</p>;

  const filteredOrders = data?.filter(order =>
    currentUser.isSeller
      ? order.taskerId._id === currentUser._id
      : order.clientId._id === currentUser._id
  );

  return (
    <div className="orders">
      <h1 className="orders-title">{currentUser.isSeller ? "Заявки на мої послуги" : "Мої замовлення"}</h1>

      {filteredOrders?.length === 0 && <p className="orders-none">Немає жодної заявки</p>}

      {filteredOrders?.map(order => (
        <div key={order._id} className="order-item">
          <div className="order-details">
            <div className="order-date">
              <p className="order-details-title"><strong>Дата замовлення:</strong> </p>
              <p className="order-details-text">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div className="order-price">
              <p className="order-details-title"><strong>Ціна:</strong></p>
              <p className="order-details-text">${order.price}</p>
            </div>
            <div className="order-location">
              <p className="order-details-title"><strong>Локація:</strong></p>
              <p className="order-details-text">{order.gigId?.location}</p>
            </div>
            <div className="order-button">
              {!currentUser.isSeller && !order.isCompleted && (
              <button className="order-red-button" onClick={() => handleCancel(order._id)}>
                ❌ Скасувати замовлення
              </button>
              )}

              {currentUser.isSeller && !order.isCompleted && (
                <button className="order-red-button" onClick={() => handleComplete(order._id)}>
                  ✅ Завершити
                </button>
              )}
            </div>
          </div>
          <hr />
          <div className={`order-banner ${order.isCompleted ? "completed" : "in-progress"}`}>
            <p><strong>Статус:</strong> {order.isCompleted ? "✅ Завершено" : "🕒 В процесі"}</p>
          </div>
          <div className="order-main-info">
            <div className="order-photo">
              <img src={order.gigId?.cover || "/img/noavatar.jpg"} alt="" />
            </div>
            <div className="order-titles">
              <h3 className="order-main-title">{order.gigId?.shortTitle || "Без назви"}</h3>
              <h4 className="order-subtitle">{order.gigId?.title || "Без назви"}</h4>
            </div>
            <div className="order-user">
              {currentUser.isSeller && (
                <>
                  <p><strong>Клієнт:</strong></p>
                  <div className="order-avatar-username">
                    <img src={order.clientId?.img || "/img/noavatar.jpg"} alt="" />
                    <p className="order-username">{order.clientId?.username}</p>
                  </div>
                </>
              )}
              {!currentUser.isSeller && (
                <>
                <p><strong>Виконавець:</strong></p>
                  <div className="order-avatar-username">
                    <img src={order.taskerId?.img || "/img/noavatar.jpg"} alt="" />
                    <p className="order-username">{order.taskerId?.username}</p>
                  </div>
                </>
              )}
            </div>
          </div>
          {currentUser.isSeller && (
            <div className="order-client-contacts">
              <img src="../../icons/mail.png" alt="" />
              <p className="order-contacts-text">{order.clientId?.email}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Orders;
