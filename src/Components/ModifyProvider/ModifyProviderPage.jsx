import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ModifyProvider.css";
import logo from "../../Assets/logo2.png";
import CustomModal from "../../Modales/CustomModal";
import Header from "../Header/Header";
import {
  BUTTONS_ACTIONS,
  ENTITIES,
  PERSON_TYPE,
  SERVICES,
} from "../../Constants/Constants";
import CircularProgress from "@mui/material/CircularProgress";

const ModifyProvider = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [send, setSend] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [entity, setEntity] = useState("proveedor");
  const [action, setAction] = useState("modificar");
  const [loading, setLoading] = useState(false);
  const [legalPerson, setLegalPerson] = useState(false);

  const [providerSend, setProviderSend] = useState({
    personDTO: {
      idPerson: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
    personType: PERSON_TYPE.NATURAL,
    bankName: "",
    bankAccountNumber: "",
    companyDTO: {
      nit: "",
      companyName: "",
      companyPhoneNumber: "",
      companyEmail: "",
      companyAddress: "",
    },
  });

  const fillProvider = (dataProvider) => {
    setProviderSend(dataProvider);
  };

  useEffect(() => {
    const fetchProviderById = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const url = `${SERVICES.GET_PROVIDER_BY_ID}/${id}`;

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
          fillProvider(data);
        } else {
          setLoading(false);
          console.error("Error al traer el proveedor:", await response.json());
        }
      } catch (error) {
        setLoading(false);
        console.error("Error en la solicitud:", error);
      }
    };

    fetchProviderById();
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
      const url = `${SERVICES.MODIFY_PROVIDER_SERVICE}/${id}`;
      const method = "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(providerSend),
      });

      if (response.ok) {
        handleModalOpen({
          selectedEntity: ENTITIES.PROVEEDOR,
          selectedAction: BUTTONS_ACTIONS.MODIFICAR,
          success: true,
        });
        setLoading(false);
      } else {
        const errorData = await response.json();
        console.error("Error al modificar el proveedor:", errorData);
      }
    } catch (error) {
      handleModalOpen({
        selectedEntity: ENTITIES.PROVEEDOR,
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

  useEffect(() => {
    if (providerSend.personType === PERSON_TYPE.LEGAL) {
      setLegalPerson(true);
    }
    if (providerSend.personType === PERSON_TYPE.NATURAL) {
      setLegalPerson(false);
    }
  }, [providerSend.personType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const validateNumericInput = (value) => {
      return value.replace(/\D/g, "");
    };

    const isNumericField =
      name === "phoneNumber" ||
      name === "bankAccountNumber" ||
      name === "companyPhoneNumber";

    const newValue = isNumericField ? validateNumericInput(value) : value;

    if (name in providerSend.personDTO) {
      setProviderSend((prevProvider) => ({
        ...prevProvider,
        personDTO: {
          ...prevProvider.personDTO,
          [name]: newValue,
        },
      }));
    } else if (name in providerSend.companyDTO) {
      setProviderSend((prevProvider) => ({
        ...prevProvider,
        companyDTO: {
          ...prevProvider.companyDTO,
          [name]: newValue,
        },
      }));
    } else {
      setProviderSend((prevProvider) => ({
        ...prevProvider,
        [name]: newValue,
      }));
    }
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
    <div className="provider-section-container">
      <Header pageTitle="Personal - Modificar proveedor" />
      <div className="provider-section">
        {loading && (
          <div className="page-loading-container">
            <CircularProgress className="page-loading-icon" />
          </div>
        )}
        <label className="providerSection-title">Modificar Proveedor</label>
        <form className="providerForm" onSubmit={handleSubmit}>
          <div className="providerForm-section">
            <h3 className="providerForm-title">
              Información del representante legal
            </h3>
            <div className="providerForm-row">
              <div className="providerForm-item">
                <label>
                  Nombres <span className="red">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={providerSend.personDTO.firstName}
                  onChange={handleInputChange}
                  onInput={handleInput}
                  required
                />
              </div>
              <div className="providerForm-item">
                <label>
                  Apellidos <span className="red">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={providerSend.personDTO.lastName}
                  onChange={handleInputChange}
                  onInput={handleInput}
                  required
                />
              </div>
            </div>
            <div className="providerForm-row">
              <div className="providerForm-item">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={providerSend.personDTO.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="providerForm-item">
                <label>
                  Teléfono <span className="red">*</span>
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={providerSend.personDTO.phoneNumber}
                  onChange={handleInputChange}
                  minLength="8"
                  maxLength="10"
                  required
                  onInvalid={handleValidation}
                  onInput={handleInputReset}
                />
              </div>
            </div>
            <div className="providerForm-row">
              <div className="providerForm-item">
                <label>
                  Tipo de documento <span className="red">*</span>
                </label>
                <select
                  name="idPerson"
                  value={providerSend.personDTO.documentType}
                  onChange={handleInputChange}
                  required
                  disabled
                >
                  <option>{providerSend.personDTO.documentType}</option>
                </select>
              </div>
              <div className="providerForm-item">
                <label>
                  Número de documento <span className="red">*</span>
                </label>
                <input
                  type="text"
                  name="idPerson"
                  value={providerSend.personDTO.idPerson}
                  onChange={handleInputChange}
                  required
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="providerForm-section">
            <h3 className="providerForm-title">Información legal</h3>
            <div className="providerForm-row">
              <div className="providerForm-item">
                <label>
                  Tipo de persona <span className="red">*</span>
                </label>
                <select
                  name="personType"
                  value={providerSend.personType}
                  onChange={handleInputChange}
                  required
                  disabled
                >
                  <option>{providerSend.personType}</option>
                </select>
              </div>
              {legalPerson && (
                <div className="providerForm-item">
                  <label>
                    Número de NIT <span className="red">*</span>
                  </label>
                  <input
                    type="text"
                    name="nit"
                    value={providerSend.companyDTO.nit}
                    onChange={handleInputChange}
                    required
                    disabled
                  />
                </div>
              )}
            </div>
            {legalPerson && (
              <div className="companyFrom-container">
                <div className="providerForm-row">
                  <div className="providerForm-item">
                    <label>
                      Empresa <span className="red">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={providerSend.companyDTO.companyName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="providerForm-item">
                    <label>Teléfono de la empresa</label>
                    <input
                      type="text"
                      name="companyPhoneNumber"
                      value={providerSend.companyDTO.companyPhoneNumber}
                      onChange={handleInputChange}
                      minLength="7"
                      maxLength="10"
                      onInvalid={handleValidation}
                      onInput={handleInputReset}
                    />
                  </div>
                </div>
                <div className="providerForm-row">
                  <div className="providerForm-item">
                    <label>Correo electrónico de la empresa</label>
                    <input
                      type="email"
                      name="companyEmail"
                      value={providerSend.companyDTO.companyEmail}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="providerForm-item">
                    <label>
                      Dirección de la empresa <span className="red">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyAddress"
                      value={providerSend.companyDTO.companyAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="providerForm-row">
              <div className="providerForm-item">
                <label>
                  Nombre del banco <span className="red">*</span>
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={providerSend.bankName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="providerForm-item">
                <label>
                  Número de cuenta <span className="red">*</span>
                </label>
                <input
                  type="text"
                  name="bankAccountNumber"
                  value={providerSend.bankAccountNumber}
                  onChange={handleInputChange}
                  minLength="10"
                  maxLength="20"
                  required
                  onInvalid={handleValidation}
                  onInput={handleInputReset}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="provider-button">
            {BUTTONS_ACTIONS.MODIFICAR.charAt(0).toUpperCase() +
              BUTTONS_ACTIONS.MODIFICAR.slice(1)}
          </button>
          <img src={logo} alt="logo" className="provider-logo" />

          {/* Componente del modal */}
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

export default ModifyProvider;
