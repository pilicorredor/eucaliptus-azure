import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ModifySeller.css";
import logo from "../../Assets/logo2.png";
import CustomModal from "../../Modales/CustomModal";
import Header from "../Header/Header";
import {
  BUTTONS_ACTIONS,
  ENTITIES,
  DOCUMENT_TYPE,
  SERVICES,
} from "../../Constants/Constants";
import CircularProgress from "@mui/material/CircularProgress";

const ModifySeller = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [send, setSend] = useState(false);
  const [update] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [entity, setEntity] = useState("vendedor");
  const [action, setAction] = useState("modificar");
  const [loading, setLoading] = useState(false);

  const [sellerSend, setSellerSend] = useState({
    personDTO: {
      idPerson: "",
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      phoneNumber: "",
      documentType: DOCUMENT_TYPE.CEDULA,
    },
    username: "",
    password: "******",
  });

  const fillSeller = (dataSeller) => {
    setSellerSend(dataSeller);
  };

  useEffect(() => {
    const fetchSellerById = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const url = `${SERVICES.GET_SELLER_BY_ID}/${id}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setLoading(false);
          const data = await response.json();
          console.log(data);
          fillSeller(data);
        } else {
          setLoading(false);
          console.error("Error al traer el vendedor:", await response.json());
        }
      } catch (error) {
        setLoading(false);
        console.error("Error en la solicitud:", error);
      }
    };

    fetchSellerById();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSend(true);
    setLoading(true);
  };

  useEffect(() => {
    if (send) {
      handleService();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [send]);

  const handleService = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `${SERVICES.MODIFY_SELLER_SERVICE}/${id}`;
      const method = "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sellerSend),
      });

      if (response.ok) {
        handleModalOpen({
          selectedEntity: ENTITIES.VENDEDOR,
          selectedAction: BUTTONS_ACTIONS.MODIFICAR,
          success: true,
        });
        setLoading(false);
      } else {
        const errorData = await response.json();
        console.error("Error al modificar el Vendedor:", errorData);
        setLoading(false);
      }
    } catch (error) {
      handleModalOpen({
        selectedEntity: ENTITIES.VENDEDOR,
        selectedAction: BUTTONS_ACTIONS.MODIFICAR,
        success: false,
      });
      console.error("Error en la solicitud:", error);
      setLoading(false);
    } finally {
      setLoading(false);
      setSend(false);
    }
  };

  const handleModalOpen = ({ selectedEntity, selectedAction, success }) => {
    setEntity(selectedEntity);
    setAction(selectedAction);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSend(false);
    navigate("/personal");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const validateNumericInput = (value) => {
      return value.replace(/\D/g, "");
    };

    const isNumericField = name === "phoneNumber";
    const newValue = isNumericField ? validateNumericInput(value) : value;

    if (name in sellerSend.personDTO) {
      setSellerSend((prevSeller) => ({
        ...prevSeller,
        personDTO: {
          ...prevSeller.personDTO,
          [name]: newValue,
        },
      }));
    } else {
      setSellerSend((prevSeller) => ({
        ...prevSeller,
        [name]: newValue,
      }));
    }

    setSellerSend((prevSeller) => ({
      ...prevSeller,
      [name]: newValue,
    }));
  };

  const handleInput = (event) => {
    const regex = /^[A-Za-z\s]*$/;
    if (!regex.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^A-Za-z\s]/g, "");
    }
  };

  const handleValidation = (e) => {
    const minLength = e.target.minLength;
    const maxLength = e.target.maxLength;
    const valueLength = e.target.value.length;

    if (valueLength < minLength) {
      e.target.setCustomValidity(
        `El número debe tener entre ${minLength} y ${maxLength} digitos.`
      );
    } else {
      e.target.setCustomValidity("");
    }
  };

  const handleInputReset = (e) => {
    e.target.setCustomValidity("");
  };

  return (
    <div className="seller-section-container">
      <Header pageTitle="Personal" />
      <div className="seller-section">
        {loading && (
          <div className="page-loading-container">
            <CircularProgress className="page-loading-icon" />
          </div>
        )}
        {update ? (
          <label className="sellerSection-title">Modificar Vendedor</label>
        ) : (
          <label className="sellerSection-title">Modificar Vendedor</label>
        )}
        <form className="sellerForm" onSubmit={handleSubmit}>
          <div className="sellerForm-section">
            <h3 className="sellerForm-title">Información básica</h3>
            <div className="sellerForm-row">
              <div className="sellerForm-item">
                <label>
                  Nombres <span className="red">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={sellerSend.personDTO.firstName}
                  onChange={handleInputChange}
                  onInput={handleInput}
                  required
                />
              </div>
              <div className="sellerForm-item">
                <label>
                  Apellidos <span className="red">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={sellerSend.personDTO.lastName}
                  onChange={handleInputChange}
                  onInput={handleInput}
                  required
                />
              </div>
            </div>
            <div className="sellerForm-row">
              <div className="sellerForm-item">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={sellerSend.personDTO.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="sellerForm-item">
                <label>
                  Teléfono <span className="red">*</span>
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={sellerSend.personDTO.phoneNumber}
                  onChange={handleInputChange}
                  minLength="8"
                  maxLength="10"
                  required
                  onInvalid={handleValidation}
                  onInput={handleInputReset}
                />
              </div>
            </div>
            <div className="sellerForm-row">
              <div className="sellerForm-item">
                <label>
                  Tipo de documento <span className="red">*</span>
                </label>
                <select
                  name="documentType"
                  value={sellerSend.personDTO.documentType}
                  onChange={handleInputChange}
                  required
                  disabled
                >
                  <option>{sellerSend.personDTO.documentType}</option>
                </select>
              </div>
              <div className="sellerForm-item">
                <label>
                  Número de documento <span className="red">*</span>
                </label>
                <input
                  type="text"
                  name="idPerson"
                  value={sellerSend.personDTO.idPerson}
                  onChange={handleInputChange}
                  required
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="sellerForm-section">
            <h3 className="sellerForm-title">Información del proveedor</h3>
            <div className="sellerForm-row">
              <div className="sellerForm-item">
                <label>
                  Usuario <span className="red">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={sellerSend.username}
                  onChange={handleInputChange}
                  required
                  disabled
                />
              </div>
              <div className="sellerForm-item">
                <label>
                  Contraseña <span className="red">*</span>
                </label>
                <input
                  type="text"
                  name="password"
                  value={sellerSend.password}
                  onChange={handleInputChange}
                  required
                  disabled
                />
              </div>
            </div>
            <div className="sellerForm-row">
              <div className="sellerForm-item">
                <label>
                  Dirección <span className="red">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={sellerSend.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="seller-button">
            {update
              ? BUTTONS_ACTIONS.MODIFICAR.charAt(0).toUpperCase() +
                BUTTONS_ACTIONS.MODIFICAR.slice(1)
              : BUTTONS_ACTIONS.MODIFICAR.charAt(0).toUpperCase() +
                BUTTONS_ACTIONS.MODIFICAR.slice(1)}
          </button>
          <img src={logo} alt="logo" className="seller-logo" />

          <CustomModal
            entity={entity}
            action={action}
            openModal={openModal}
            onClose={handleModalClose}
          />
        </form>
      </div>
    </div>
  );
};

export default ModifySeller;
