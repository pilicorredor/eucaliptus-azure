import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../Header/Header.jsx";
import CustomTableSale from "../CustomTableSale/CustomTableSale.jsx";
import "./RegisterSale.css";
import CustomModal from "../../Modales/CustomModal";
import CircularProgress from "@mui/material/CircularProgress";
import { SERVICES, ENTITIES, BUTTONS_ACTIONS } from "../../Constants/Constants";
import FailModal from "../../Modales/FailModal.jsx"

const RegisterSale = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialSummaryData = location.state?.summaryData || [];
  const [summaryData, setSummaryData] = useState(initialSummaryData);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [entity, setEntity] = useState("venta");
  const [action, setAction] = useState("registrar");
  const [clientFound, setClientFound] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageFail, setMessageFail] = useState("");
  const [consumerData, setConsumerData] = useState({
    idClient: "",
    nameClient: "",
    email: "",
  });

  const handleModalOpen = ({ selectedEntity, selectedAction }) => {
    setEntity(selectedEntity);
    setAction(selectedAction);
    setOpenModal(true);
  };

  const handleNextSale = () => {
    setLoading(true);
    handleService();
  };

  const handleClientSearch = async (idClient) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${SERVICES.GET_CLIENT_BY_ID}/${idClient}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const clientData = await response.json();
        setConsumerData({
          idClient: clientData.idClient,
          nameClient: clientData.nameClient,
          email: clientData.email,
        });
        setClientFound(true);
      } else {
        setClientFound(false);
        setConsumerData((prev) => ({
          ...prev,
          nameClient: "",
          email: "",
        }));
      }
    } catch (error) {
      setMessageFail("Error al buscar el cliente");
      setIsModalOpen(true);
      setClientFound(false);
    }
  };

  const handleService = async () => {
    const saleObject = generateSaleObject();
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(SERVICES.ADD_SALE_SERVICE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(saleObject),
      });

      if (response.ok) {
        const dataSale = await response.json();
        const saleDetails = dataSale.saleDetails;
        const clientData = dataSale.clientDTO;
        setLoading(false);
        navigate("/factura-venta", {
          state: { saleDetails, clientData, dataSale },
        });
      } else {
        handleModalOpen({
          selectedEntity: ENTITIES.VENTA,
          selectedAction: BUTTONS_ACTIONS.REGISTRAR,
        });
        setLoading(false);
      }
    } catch (error) {
      handleModalOpen({
        selectedEntity: ENTITIES.VENTA,
        selectedAction: BUTTONS_ACTIONS.REGISTRAR,
      });
      setLoading(false);
    }
  };

  const generateSaleObject = () => {
    const defaultClientData = {
      idClient: "0000000000",
      nameClient: "Cliente General",
      email: "sincorreo@ejemplo.com",
    };

    const saleDetails = summaryData.map((product) => ({
      idProduct: product.idProduct,
      quantitySold: product.quantitySold,
    }));

    const colombianDate = new Date().toLocaleDateString("en-CA", {
      timeZone: "America/Bogota",
    });

    const clientData = {
      idClient: consumerData.idClient || defaultClientData.idClient,
      nameClient: consumerData.nameClient || defaultClientData.nameClient,
      email: consumerData.email || defaultClientData.email,
    };

    return {
      clientDTO: clientData,
      dateSale: colombianDate,
      saleDetails,
    };
  };

  const handleRemoveFromSummary = (id) => {
    setSummaryData((prevSummary) =>
      prevSummary.filter((item) => item.id_modify !== id)
    );
  };

  const columnsProducts = [
    "idProduct",
    "productName",
    "quantitySold",
    "use",
    "productSalePrice",
    "subTotal",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const validateNumericInput = (value) => {
      return value.replace(/\D/g, "");
    };

    if (name === "idClient") {
      const processedValue = validateNumericInput(value);

      setConsumerData((prevConsumer) => ({
        ...prevConsumer,
        [name]: processedValue,
        ...(processedValue === "" && { nameClient: "", email: "" }),
      }));
      if (processedValue.length >= 7) {
        handleClientSearch(processedValue);
      } else {
        setClientFound(false);
      }
    } else {
      setConsumerData((prevConsumer) => ({
        ...prevConsumer,
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

  const handleModalClose = () => {
    setOpenModal(false);
    navigate("/nueva-venta");
  };

  return (
    <div className="products-sale">
      <Header pageTitle="Registrar Venta" />
      <div>
        <div className="steps-section-register-sale">
          <label className="step-by-step-register-sale">Paso 2 de 2</label>
          <label className="step-information-register-sale">
            Datos del cliente
          </label>
        </div>
        {loading && (
          <div className="page-loading-container">
            <CircularProgress className="page-loading-icon" />
          </div>
        )}
        <div className="customer-info-row">
          <div className="customer-info-field">
            <label>Número de Documento:</label>
            <input
              type="text"
              placeholder="Ingrese el documento"
              name="idClient"
              value={consumerData.idClient}
              onChange={handleInputChange}
              minLength="7"
              maxLength="10"
              onInvalid={handleValidation}
              onInput={handleInputReset}
              className="customer-input"
            />
          </div>
          <div className="customer-info-field">
            <label>Nombre:</label>
            <input
              type="text"
              placeholder="Ingrese el nombre"
              name="nameClient"
              value={consumerData.nameClient}
              onChange={handleInputChange}
              onInput={handleInput}
              disabled={clientFound}
              className="customer-input"
            />
          </div>
          <div className="customer-info-field">
            <label>Correo electrónico:</label>
            <input
              type="email"
              placeholder="Ingrese el correo"
              name="email"
              value={consumerData.email}
              onChange={handleInputChange}
              disabled={clientFound}
              className="customer-input"
            />
          </div>
        </div>
        <div className="steps-section-register-sale">
          <label className="step-information-register-sale">
            Resumen de venta
          </label>
        </div>
        <CustomTableSale
          widthTable={"100%"}
          dataProducts={summaryData}
          customColumns={columnsProducts}
          handleRemove={handleRemoveFromSummary}
          isNewSale={false}
        />

        <div className="generate-sale-btn-container">
          <button
            className="generate-sale-btn"
            onClick={handleNextSale}
            disabled={summaryData.length === 0}
          >
            Generar Venta
          </button>
        </div>
        <CustomModal
          entity={entity}
          action={action}
          openModal={openModal}
          onClose={handleModalClose}
          successfull={false}
        />
        <FailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          message={messageFail} />
      </div>
    </div>
  );
};
export default RegisterSale;
