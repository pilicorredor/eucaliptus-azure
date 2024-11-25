import React from "react";
import "./NotificationModal.css";
import logo from "../../Assets/logo.jpg";
import { IoMdCloseCircle } from "react-icons/io";

const NotificationModal = ({
  isOpen,
  onClose,
  notifications,
  deleteNotification,
}) => {
  if (!isOpen) return null;

  function isAlertMessage(notification) {
    const { message } = notification;
    return message && message.toLowerCase().includes("alerta");
  }

  return (
    <div className="notif-overlay">
      <div className="notif-content">
        <div className="notif-header">
          <img src={logo} alt="logo" className="header-logo" />
          <div className="header-text">
            <h2>Sistema de Gestión de Inventario</h2>
            <h3>Naturista Eucaliptus</h3>
          </div>
          <button className="close-btn-notif" onClick={onClose}>
            <IoMdCloseCircle />
          </button>
        </div>
        <div className="notif-body-wrapper">
          <div className="notif-body">
            <div className="notif-body body-title">Notificaciones</div>
            <div className="body-messages">
              {notifications.map((notification) => (
                <div
                  key={notification.idNotification}
                  className={`notification-item alert ${
                    isAlertMessage(notification) ? "alerta" : ""
                  }`}
                >
                  <p>{notification.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
