import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../../Assets/logo2.png";
import Header from "../Header/Header";
import CustomModal from "../../Modales/CustomModal";
import UnitModal from "../../Modales/UnitModal";
import "./FormRegisterProduct.css";
import {
  USE_PRODUCTS,
  CATEGORY_PRODUCT,
  BUTTONS_ACTIONS,
  SERVICES,
  ENTITIES,
} from "../../Constants/Constants";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";

const RegisterProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState("");
  const [unit, setUnit] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [send, setSend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [entity, setEntity] = useState("producto");
  const [action, setAction] = useState("registrar");
  const [openModalUnit, setOpenModalUnit] = useState(false);
  const [modalUnitMode, setModalUnitMode] = useState("addUnit");
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [setIsModalOpen] = useState(false);
  const [setMessageFail] = useState("");
  const [product, setProduct] = useState({
    idProduct: "",
    productName: "",
    brand: "",
    category: CATEGORY_PRODUCT.PERISHABLE,
    use: USE_PRODUCTS.SUPPLEMENTS,
    idProvider: id,
    description: "",
    unitName: "",
    descriptionUnit: "",
    minimumProductAmount: "",
    maximumProductAmount: "",
  });

  const [sendProduct, setSendProduct] = useState({
    idProduct: "",
    productName: "",
    brand: "",
    category: CATEGORY_PRODUCT.PERISHABLE,
    use: USE_PRODUCTS.SUPPLEMENTS,
    idProvider: id,
    description: "",
    unitDTO: {
      unitName: "",
      description: "",
    },
    minimumProductAmount: "",
    maximumProductAmount: "",
  });

  useEffect(() => {
    const fetchProviderById = async () => {
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
          const data = await response.json();
          const providerName = `${data.personDTO.firstName} ${data.personDTO.lastName}`;
          setProvider(providerName);
        } else {
          setMessageFail("No fue posible obtener el vendedores");
          setIsModalOpen(true);
        }
      } catch (error) {
        setMessageFail("Ocurrió un error en la solicitud");
        setIsModalOpen(true);
      }
    };

    fetchProviderById();
    fetchUnit();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchUnit = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = SERVICES.GET_PRODUCTS_UNITS_SERVICE;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const units = await response.json();
        setUnit(units);
      } else {
        setMessageFail("No fue posible obtener las unidades");
        setIsModalOpen(true);
      }
    } catch (error) {
      setMessageFail("Ocurrió un error en la solicitud");
      setIsModalOpen(true);
    }
  };

  const fetchDescriptionByUnit = async (unitName) => {
    try {
      const token = localStorage.getItem("token");
      const url = `${SERVICES.GET_PRODUCTS_UNITS_DESCRIPTION_SERVICE}/${unitName}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDescriptions(data);
      } else {
        setMessageFail("No fue posible obtener las descripciones");
        setIsModalOpen(true);
      }
    } catch (error) {
      setMessageFail("Ocurrió un error en la solicitud");
      setIsModalOpen(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (tooltipOpen) {
      return; // Evita el envío del formulario si el tooltip de cantidades está abierto
    }

    setSendProduct({
      idProduct: product.idProduct,
      productName: product.productName,
      brand: product.brand,
      category: product.category,
      use: product.use,
      idProvider: id,
      description: product.description,
      unitDTO: {
        unitName: product.unitName,
        description: product.descriptionUnit,
      },
      minimumProductAmount: product.minimumProductAmount,
      maximumProductAmount: product.maximumProductAmount,
    });
    setSend(true);
    setLoading(true);
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

  // Cerrar el modal
  const handleModalClose = () => {
    setProduct({
      idProduct: "",
      productName: "",
      brand: "",
      category: CATEGORY_PRODUCT.PERISHABLE,
      use: USE_PRODUCTS.SUPPLEMENTS,
      idProvider: id,
      description: "",
      unitName: "",
      descriptionUnit: "",
      minimumProductAmount: "",
      maximumProductAmount: "",
    });
    setOpenModal(false);
    setSend(false);
    navigate("/productos");
  };

  const handleService = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(SERVICES.REGISTER_PRODUCT_SERVICE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sendProduct),
      });

      if (response.ok) {
        handleModalOpen({
          selectedEntity: ENTITIES.PRODUCTO,
          selectedAction: BUTTONS_ACTIONS.REGISTRAR,
          success: true,
        });
        setLoading(false);
        setSend(false);
      } else {
        setMessageFail("Ocurrió un error al registrar el producto");
        setIsModalOpen(true);
        setLoading(false);
        setSend(false);
      }
    } catch (error) {
      handleModalOpen({
        selectedEntity: ENTITIES.PRODUCTO,
        selectedAction: BUTTONS_ACTIONS.REGISTRAR,
        success: false,
      });
      console.error("Error en la solicitud:", error);
      setLoading(false);
      setSend(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));

    if (name === "unitName") {
      fetchDescriptionByUnit(value);
    }

    //Validaciones para que la cantidad minima sea menor que la de cantidad maxima
    if (name === "minimumProductAmount" || name === "maximumProductAmount") {
      const minAmount =
        name === "minimumProductAmount" ? value : product.minimumProductAmount;
      const maxAmount =
        name === "maximumProductAmount" ? value : product.maximumProductAmount;

      if (parseInt(minAmount, 10) >= parseInt(maxAmount, 10)) {
        setTooltipOpen(true);
      } else {
        setTooltipOpen(false);
      }
    }
  };

  const handleAddUnit = () => {
    setModalUnitMode("addUnit");
    setOpenModalUnit(true);
  };

  const handleAddDescription = () => {
    setModalUnitMode("addDescription");
    setOpenModalUnit(true);
  };

  const handleSaveUnitData = async (unitData) => {
    try {
      console.log("productos que llegan acá: ", unitData);
      const token = localStorage.getItem("token");
      const response = await fetch(SERVICES.ADD_UNIT_SERVICE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          unitName: unitData.unitName,
          description: unitData.description,
        }),
      });

      if (!response.ok) {
        //throw new Error("Error al guardar la unidad en la base de datos");
        setMessageFail("Error al guardar la unidad en la base de datos");
        setIsModalOpen(true);
      }
    } catch (error) {
      setMessageFail("No se pudo guardar la unidad. Inténtalo de nuevo.");
      setIsModalOpen(true);
    }
    fetchUnit();
    fetchDescriptionByUnit(unitData.unitName);
    setOpenModalUnit(false);
  };

  return (
    <div className="product-section-container">
      <Header pageTitle="Productos - Registrar" />
      <div>
        <div className="product-section">
          <label className="product-section-title">
            Agregar Nuevo Producto
          </label>
        </div>
        <div className="steps-section">
          <div className="stepTwo-title-left">
            <label className="step-by-step">Paso 2 de 2</label>
            <label className="step-information-2">
              Información del producto
            </label>
            {loading && (
              <div className="page-loading-container">
                <CircularProgress className="page-loading-icon" />
              </div>
            )}
          </div>
          <div className="stepTwo-title-right">
            <label>Proveedor: {provider}</label>
            <button
              className="change-btn"
              onClick={() => navigate("/productos/escoger-proveedor")}
            >
              Cambiar
            </button>
          </div>
        </div>
      </div>
      <form className="productForm" onSubmit={handleSubmit}>
        <div className="productForm-section">
          <div className="productForm-row">
            <div className="productForm-item">
              <label>
                Identificador <span className="red">*</span>
              </label>
              <input
                type="text"
                name="idProduct"
                value={product.idProduct}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="productForm-item">
              <label>
                Nombre <span className="red">*</span>
              </label>
              <input
                type="text"
                name="productName"
                value={product.productName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="productForm-row">
            <div className="productForm-item">
              <label>
                Categoría <span className="red">*</span>
              </label>
              <select
                name="category"
                value={product.category}
                onChange={handleInputChange}
                required
              >
                <option value={CATEGORY_PRODUCT.PERISHABLE}>Perecedero</option>
                <option value={CATEGORY_PRODUCT.NON_PERISHABLE}>
                  No Perecedero
                </option>
              </select>
            </div>
            <div className="productForm-item">
              <label>
                Uso <span className="red">*</span>
              </label>
              <select
                name="use"
                value={product.use}
                onChange={handleInputChange}
                required
              >
                <option value={USE_PRODUCTS.SUPPLEMENTS}>Suplementos</option>
                <option value={USE_PRODUCTS.HOMEOPATHIC}>Homeopáticos</option>
                <option value={USE_PRODUCTS.PHYTOTHERAPEUTIC}>
                  Fitoterapéuticos
                </option>
                <option value={USE_PRODUCTS.SPICES}>Especias</option>
                <option value={USE_PRODUCTS.ESOTERIC}>Esotéricos</option>
                <option value={USE_PRODUCTS.PERSONAL_CARE}>
                  Cuidado Personal
                </option>
                <option value={USE_PRODUCTS.OTHER}>Otros</option>
              </select>
            </div>
          </div>
          <div className="productForm-row">
            <div className="productForm-item">
              <label>
                Unidad <span className="red">*</span>
              </label>
              <div className="unit-container">
                <select
                  name="unitName"
                  value={product.unitName}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled hidden>
                    Seleccione una unidad
                  </option>
                  {unit.map((u, index) => (
                    <option key={index} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="add-unit-btn"
                  onClick={handleAddUnit}
                >
                  +
                </button>
              </div>
            </div>
            <div className="productForm-item">
              <label>
                Descripción de la unidad <span className="red">*</span>
              </label>
              <div className="unit-container">
                <select
                  name="descriptionUnit"
                  value={product.descriptionUnit}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled hidden>
                    Seleccione una descripción
                  </option>
                  {descriptions.map((desc, index) => (
                    <option key={index} value={desc}>
                      {desc}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="add-unit-btn"
                  onClick={handleAddDescription}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="productForm-row">
            <div className="productForm-item">
              <label>
                Cantidad mínima del producto <span className="red">*</span>
              </label>
              <Tooltip
                open={tooltipOpen}
                title="La cantidad mínima debe ser menor que la cantidad máxima"
                arrow
              >
                <input
                  type="number"
                  name="minimumProductAmount"
                  value={product.minimumProductAmount}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </Tooltip>
            </div>
            <div className="productForm-item">
              <label>
                Cantidad máxima del producto <span className="red">*</span>
              </label>
              <Tooltip
                open={tooltipOpen}
                title="La cantidad máxima debe ser mayor que la cantidad mínima"
                arrow
              >
                <input
                  type="number"
                  name="maximumProductAmount"
                  value={product.maximumProductAmount}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </Tooltip>
            </div>
          </div>
          <div className="productForm-row">
            <div className="productForm-item">
              <label>
                Marca <span className="red">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={product.brand}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="productForm-item">
              <label>Detalles del producto</label>
              <textarea
                className="custom-textarea"
                name="description"
                value={product.description}
                rows="2"
                cols="40"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={tooltipOpen}
          className="provider-button"
        >
          {BUTTONS_ACTIONS.REGISTRAR.charAt(0).toUpperCase() +
            BUTTONS_ACTIONS.REGISTRAR.slice(1)}
        </button>
        <img src={logo} alt="logo" className="product-logo" />
        {/* Componente del modal */}
        <CustomModal
          entity={entity}
          action={action}
          openModal={openModal}
          onClose={handleModalClose}
        />
        <UnitModal
          isOpen={openModalUnit}
          onClose={() => setOpenModalUnit(false)}
          unitName={product.unitName}
          onSave={handleSaveUnitData}
          mode={modalUnitMode}
        />
      </form>
    </div>
  );
};

export default RegisterProduct;
