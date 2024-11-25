import React, { useState, useEffect } from "react";
import Header from "../Header/Header.jsx";
import userImg from "../../Assets/person-circle.png";
import "./ConfigPanel.css";
import { FaEdit } from "react-icons/fa";
import { SERVICES } from "../../Constants/Constants.js";
import CircularProgress from "@mui/material/CircularProgress";
import SuccessModal from "../../Modales/SuccessModal.jsx";
import FailModal from "../../Modales/FailModal.jsx";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../Constants/Constants";

const Config = ({ userRol, username, handleLogout }) => {
  const [isNameEditable, setIsNameEditable] = useState(false);
  const [isLastNameEditable, setIsLastNameEditable] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [isUsernameEditable, setIsUsernameEditable] = useState(false);
  const [personData, setPersonData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: username,
    "config-input-name": "",
    "config-input-lastname": "",
    "config-input-username": "",
    "config-input-email": "",
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState("");
  const [messageFail, setMessageFail] = useState("");
  const [isSuccesful, setIsSuccesful] = useState(false);
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState("Rol no asignado");

  useEffect(() => {
    if (userRol === ROLES.ADMIN) {
      setRoleName("Administrador");
    } else {
      setRoleName("Vendedor");
    }
  }, [userRol]);

  let dataToSend = [];

  const token = localStorage.getItem("token");

  const handleEditName = (event) => {
    event.preventDefault();
    setIsNameEditable(!isNameEditable);
  };

  const handleEditLastName = (event) => {
    event.preventDefault();
    setIsLastNameEditable(!isLastNameEditable);
  };

  const handleEditEmail = (event) => {
    event.preventDefault();
    setIsEmailEditable(!isEmailEditable);
  };

  const handleEditUsername = (event) => {
    event.preventDefault();
    setIsUsernameEditable(!isUsernameEditable);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchPersonInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(SERVICES.CONFIG_GET_SELLER_DATA_SERVICE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setLoading(false);
        const data = await response.json();
        setPersonData({
          idPerson: data.personDTO.idPerson,
          firstName: data.personDTO.firstName,
          lastName: data.personDTO.lastName,
          email: data.personDTO.email,
          username,
        });
      } else {
        //alert("No fue posible recuperar los datos")
        setMessageFail("No fue posible recuperar los datos");
        setIsModalOpen(true);
      }
    } catch (error) {
      setLoading(false);
      setMessageFail(
        "Error interno del servidor durante la recuperacion de datos"
      );
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    fetchPersonInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitBtn = async () => {
    dataToSend = {
      firstName: personData["config-input-name"] || personData.firstName,
      lastName: personData["config-input-lastname"] || personData.lastName,
      oldUsername: username,
      newUsername: personData["config-input-username"] || username,
      email: personData["config-input-email"] || personData.email,
    };
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(SERVICES.CONFIG_UPDATE_USER_INFO, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });
      if (response.ok) {
        setLoading(false);
        fetchPersonInfo();
        setIsSuccesful(true);
        setMessageSuccess("Cambios guardados con éxito!");
        setIsModalOpen(true);
        // Si el username ha cambiado, forzar logout
        if (dataToSend.newUsername !== username) {
          setTimeout(() => {
            handleLogout();
            navigate("/");
          }, 2000); // Agrega un retraso para mostrar el modal antes de cerrar sesión
        }
      } else {
        setLoading(false);
        setMessageFail("No fue posible guardar los cambios");
        setIsModalOpen(true);
      }
    } catch (error) {
      setLoading(false);
      setMessageFail("Error durante el envio de los cambios");
      setIsModalOpen(true);
    }
  };

  return (
    <div className="config">
      <Header pageTitle="Configuración" />
      <div className="cofig-content">
        <div className="card-user-info">
          <img src={userImg} alt="User Icon" />
          <div className="config-name">
            {personData.firstName} {personData.lastName}
          </div>
          <div className="config-userRol">Rol: {roleName}</div>
        </div>
        <p className="config-p">
          Actualiza la información de tu perfil en el momento que lo necesites,
          cuando estes satisfecho con tus cambios dale click al botón de
          “Guardar Cambios” y listo!
        </p>
        <form className="config-form">
          {loading && (
            <div className="loading-container">
              <CircularProgress className="loading-icon" />
            </div>
          )}
          <div className="configForm-row">
            <div className="configForm-item">
              <label>Nombres</label>
              <div className="config-input-and-button">
                <input
                  type="text"
                  name="config-input-name"
                  placeholder={personData.firstName}
                  onChange={handleInputChange}
                  disabled={!isNameEditable}
                />
                <button onClick={handleEditName}>
                  <FaEdit />
                </button>
              </div>
            </div>
            <div className="configForm-item">
              <label>Apellidos</label>
              <div className="config-input-and-button">
                <input
                  type="text"
                  name="config-input-lastname"
                  placeholder={personData.lastName}
                  onChange={handleInputChange}
                  disabled={!isLastNameEditable}
                />
                <button onClick={handleEditLastName}>
                  <FaEdit />
                </button>
              </div>
            </div>
          </div>
          <div className="configForm-row">
            <div className="configForm-item">
              <label>Username</label>
              <div className="config-input-and-button">
                <input
                  type="text"
                  name="config-input-username"
                  placeholder={username}
                  onChange={handleInputChange}
                  disabled={!isUsernameEditable}
                />
                <button onClick={handleEditUsername}>
                  <FaEdit />
                </button>
              </div>
            </div>
            <div className="configForm-item">
              <label>Correo</label>
              <div className="config-input-and-button">
                <input
                  type="text"
                  name="config-input-email"
                  placeholder={personData.email}
                  onChange={handleInputChange}
                  disabled={!isEmailEditable}
                />
                <button onClick={handleEditEmail}>
                  <FaEdit />
                </button>
              </div>
            </div>
          </div>
          <div className="configForm-row">
            <div className="configForm-item">
              <label>Contraseña</label>
              <div className="config-input-and-button">
                <input
                  type="text"
                  name="config-input-password"
                  placeholder="**********"
                  disabled={true}
                />
              </div>
              <a href="/config/login-to-change-password" onClick={handleLogout}>
                Actualizar contraseña
              </a>
            </div>
          </div>
          {isSuccesful ? (
            <SuccessModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              message={messageSuccess}
            />
          ) : (
            <FailModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              message={messageFail}
            />
          )}
        </form>
        <div className="config-button-container">
          <button
            className="confing-submit-btn"
            type="config-submit"
            onClick={handleSubmitBtn}
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default Config;
