import React, { useState, useEffect } from "react";
import { IoNotificationsSharp } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import "./Header.css";
import logo from "../../Assets/logoInterfaces.png";
import NotificationModal from "./NotificationModal";
import { useNavigate } from "react-router-dom";
import { SERVICES } from "../../Constants/Constants.js";
import FailModal from "../../Modales/FailModal.jsx";

const Header = ({ pageTitle }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [messageFail, setMessageFail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(SERVICES.GET_SOTCK_NOTIFICATIONS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        setMessageFail("No fue posible recuperar las notificaciones");
        setIsModalOpen(true);
      }
    } catch (error) {
      setMessageFail(
        "Error interno del servidor durante la recuperacion de datos"
      );
      setIsModalOpen(true);
    }
  };

  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter(
      (notification) => notification.idNotification !== id
    );
    setNotifications(updatedNotifications);
  };

  const handleNotificationClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSettingsClick = () => {
    navigate("/config");
  };

  return (
    <div className="header">
      <div className="page-title">{pageTitle}</div>
      <ul className="header-options">
        <li>
          <IoMdSettings
            className="header-link"
            onClick={handleSettingsClick}
            style={{ cursor: "pointer" }}
          />
        </li>
        <li>
          <IoNotificationsSharp
            className="header-link"
            onClick={handleNotificationClick}
            style={{ cursor: "pointer" }}
          />
        </li>
        <li>
          <img src={logo} alt="logo" className="header-logo" />
        </li>
      </ul>
      {showModal && (
        <NotificationModal
          isOpen={showModal}
          onClose={handleCloseModal}
          notifications={notifications}
          deleteNotification={deleteNotification}
        />
      )}
      <FailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={messageFail}
      />
    </div>
  );
};

export default Header;
