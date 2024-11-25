// ProviderModal.js
import React, { useState, useEffect } from "react";
import "./RegisterProviderModal.css";
import {
  BUTTONS_ACTIONS,
  ROLES,
  PERSON_TYPE,
  SERVICES,
  DOCUMENT_TYPE,
  ENTITIES,
  ERRORS,
} from "../Constants/Constants";
import CircularProgress from "@mui/material/CircularProgress";
import CustomModal from "../Modales/CustomModal";
import ErrorSpecificModal from "../Modales/ErrorSpecificModal";

const RegisterProviderModal = ({ isOpen, onClose, handleSubmit }) => {
  const [openModal, setOpenModal] = useState(false);
  const [send, setSend] = useState(false);
  const [validationProvider, setValidationProvider] = useState(false);
  const [openModalValidation, setOpenModalValidation] = useState(false);
  const [errorValidate, setErrorValidate] = useState("");
  const [messageErrorValidate, setMessageErrorValidate] = useState("");
  const [entity, setEntity] = useState("proveedor");
  const [action, setAction] = useState("registrar");
  const [legalPerson, setLegalPerson] = useState(false);
  const [loading, setLoading] = useState(false);
  const [providerSend, setProviderSend] = useState({
    personDTO: {
      idPerson: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      documentType: DOCUMENT_TYPE.CEDULA,
      role: ROLES.PROVIDER,
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

  const [provider, setProvider] = useState({
    idPerson: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    documentType: DOCUMENT_TYPE.CEDULA,
    personType: PERSON_TYPE.NATURAL,
    nit: "",
    companyName: "",
    companyPhoneNumber: "",
    companyEmail: "",
    companyAddress: "",
    bankName: "",
    bankAccountNumber: "",
  });

  const handleModalClose = () => {
    setProvider({
      idPerson: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      documentType: DOCUMENT_TYPE.CEDULA,
      personType: PERSON_TYPE.NATURAL,
      nit: "",
      companyName: "",
      companyPhoneNumber: "",
      companyEmail: "",
      companyAddress: "",
      bankName: "",
      bankAccountNumber: "",
    });
    setOpenModalValidation(false);
    setOpenModal(false);
    setSend(false);
    onClose();
  };

  useEffect(() => {
    if (send) {
      handleService();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [send]);

  const handleModalOpen = ({ selectedEntity, selectedAction }) => {
    setEntity(selectedEntity);
    setAction(selectedAction);
    setOpenModal(true);
  };

  const handleModalValidationOpen = ({
    errorValidate,
    messageErrorValidate,
  }) => {
    setErrorValidate(errorValidate);
    setMessageErrorValidate(messageErrorValidate);
    setOpenModalValidation(true);
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const updatedProviderSend = {
      personDTO: {
        idPerson: provider.idPerson,
        firstName: provider.firstName,
        lastName: provider.lastName,
        email: provider.email,
        phoneNumber: provider.phoneNumber,
        documentType: provider.documentType,
      },
      personType: provider.personType,
      bankName: provider.bankName,
      bankAccountNumber: provider.bankAccountNumber,
    };

    if (provider.personType === PERSON_TYPE.LEGAL) {
      updatedProviderSend.companyDTO = {
        nit: provider.nit,
        companyName: provider.companyName,
        companyPhoneNumber: provider.companyPhoneNumber,
        companyEmail: provider.companyEmail,
        companyAddress: provider.companyAddress,
      };
    }
    setProviderSend(updatedProviderSend);
    setValidationProvider(true);
  };

  useEffect(() => {
    if (validationProvider) {
      handleValidateProvider();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validationProvider]);

  const handleValidateProvider = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(SERVICES.VALIDATE_PROVIDER_SERVICE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(providerSend),
      });
      if (response.ok) {
        setSend(true);
        setLoading(true);
      } else {
        const errorData = await response.json();
        setErrorValidate(response.status);

        if (response.status === ERRORS.ERROR_302) {
          handleModalValidationOpen({
            errorValidate: response.status,
            messageErrorValidate:
              "La empresa ya se había registrado anteriormente. ¿Desea recuperar los datos o sobreescribirlos?",
          });
        } else {
          handleModalValidationOpen({
            errorValidate: response.status,
            messageErrorValidate: errorData.message,
          });
        }

        setLoading(false);
        setSend(false);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setLoading(false);
      setSend(false);
    }
  };

  const handleService = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(SERVICES.REGISTER_PROVIDER_SERVICE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(providerSend),
      });

      if (response.ok) {
        handleModalOpen({
          selectedEntity: ENTITIES.PROVEEDOR,
          selectedAction: BUTTONS_ACTIONS.REGISTRAR,
          success: true,
        });
        setLoading(false);
        setSend(false);
      } else {
        const errorData = await response.json();
        console.error("Error al registrar el proveedor:", errorData);
        setLoading(false);
        setSend(false);
      }
    } catch (error) {
      handleModalOpen({
        selectedEntity: ENTITIES.PROVEEDOR,
        selectedAction: BUTTONS_ACTIONS.REGISTRAR,
        success: false,
      });
      console.error("Error en la solicitud:", error);
      setLoading(false);
      setSend(false);
    }
  };

  const handleRecoverData = () => {
    const fetchCompanyById = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const url = `${SERVICES.GET_COMPANY_BY_NIT_SERVICE}/${provider.nit}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProviderSend((prevProviderSend) => ({
            ...prevProviderSend,
            companyDTO: {
              nit: provider.nit,
              companyAddress: data.companyAddress,
              companyName: data.companyName,
              companyPhoneNumber: data.companyPhoneNumber,
              companyEmail: data.companyEmail,
            },
          }));
          setLoading(false);
          setSend(true);
        } else {
          setLoading(false);
          console.error("Error al traer la compañia:", await response.json());
        }
      } catch (error) {
        setLoading(false);
        console.error("Error en la solicitud:", error);
      }
    };
    fetchCompanyById();
    setOpenModalValidation(false);
    setLoading(true);
  };

  const handleOverwriteData = () => {
    setOpenModalValidation(false);
    setLoading(true);
    setSend(true);
  };

  useEffect(() => {
    if (provider.personType === PERSON_TYPE.LEGAL) {
      setLegalPerson(true);
    }
    if (provider.personType === PERSON_TYPE.NATURAL) {
      setLegalPerson(false);
    }
  }, [provider.personType]);

  //Validaciones
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const validateNumericInput = (value) => {
      return value.replace(/\D/g, "");
    };

    const validateAlphaNumericInput = (value) => {
      return value.replace(/[^A-Za-z0-9]/g, "");
    };

    if (
      name === "phoneNumber" ||
      name === "idPerson" ||
      name === "nit" ||
      name === "bankAccountNumber" ||
      name === "companyPhoneNumber"
    ) {
      const processedValue =
        name === "idPerson" && provider.documentType === DOCUMENT_TYPE.PASSPORT
          ? validateAlphaNumericInput(value)
          : validateNumericInput(value);

      setProvider((prevProvider) => ({
        ...prevProvider,
        [name]: processedValue,
      }));
    } else {
      setProvider((prevProvider) => ({
        ...prevProvider,
        [name]: value,
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

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    isOpen && (
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-content">
          {loading && (
            <div className="page-loading-container">
              <CircularProgress className="page-loading-icon" />
            </div>
          )}
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
                    value={provider.firstName}
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
                    value={provider.lastName}
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
                    placeholder="usuario@example.com"
                    value={provider.email}
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
                    value={provider.phoneNumber}
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
                    name="documentType"
                    value={provider.documentType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value={DOCUMENT_TYPE.CEDULA}>
                      Cédula de Ciudadanía
                    </option>
                    <option value={DOCUMENT_TYPE.IMMIGRATION_CARD}>
                      Cédula de Extranjería
                    </option>
                    <option value={DOCUMENT_TYPE.PASSPORT}>Pasaporte</option>
                  </select>
                </div>
                <div className="providerForm-item">
                  <label>
                    Número de documento <span className="red">*</span>
                  </label>
                  <input
                    type="text"
                    name="idPerson"
                    value={provider.idPerson}
                    onChange={handleInputChange}
                    minLength="7"
                    maxLength="10"
                    required
                    onInvalid={handleValidation}
                    onInput={handleInputReset}
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
                    value={provider.personType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value={PERSON_TYPE.NATURAL}>Natural</option>
                    <option value={PERSON_TYPE.LEGAL}>Jurídica</option>
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
                      value={provider.nit}
                      onChange={handleInputChange}
                      minLength="9"
                      maxLength="10"
                      required
                      onInvalid={handleValidation}
                      onInput={handleInputReset}
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
                        value={provider.companyName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="providerForm-item">
                      <label>Teléfono de la empresa</label>
                      <input
                        type="text"
                        name="companyPhoneNumber"
                        value={provider.companyPhoneNumber}
                        onChange={handleInputChange}
                        minLength="8"
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
                        placeholder="usuario@example.com"
                        value={provider.companyEmail}
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
                        value={provider.companyAddress}
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
                    value={provider.bankName}
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
                    value={provider.bankAccountNumber}
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
              {BUTTONS_ACTIONS.REGISTRAR.charAt(0).toUpperCase() +
                BUTTONS_ACTIONS.REGISTRAR.slice(1)}
            </button>

            <ErrorSpecificModal
              error={errorValidate}
              message={messageErrorValidate}
              isOpen={openModalValidation}
              onClose={handleModalClose}
              onOverwrite={handleOverwriteData}
              onRecover={handleRecoverData}
            />
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
    )
  );
};

export default RegisterProviderModal;
