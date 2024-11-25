// ProviderModal.js
import React, { useState, useEffect } from "react";
import "./RegisterProductModal.css";
import {
  BUTTONS_ACTIONS,
  SERVICES,
  ENTITIES,
  CATEGORY_PRODUCT,
  USE_PRODUCTS,
} from "../Constants/Constants";
import CircularProgress from "@mui/material/CircularProgress";
import CustomModal from "../Modales/CustomModal";
import Tooltip from "@mui/material/Tooltip";
import UnitModal from "../Modales/UnitModal";

const RegisterProductModal = ({ id, isOpen, onClose, handleSubmit }) => {
  const [openModal, setOpenModal] = useState(false);
  const [send, setSend] = useState(false);
  const [entity, setEntity] = useState("producto");
  const [action, setAction] = useState("registrar");
  const [unit, setUnit] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModalUnit, setOpenModalUnit] = useState(false);
  const [modalUnitMode, setModalUnitMode] = useState("addUnit");
  const [tooltipOpen, setTooltipOpen] = useState(false);
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
    fetchUnit();
  }, []);

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
        console.error("Error al traer las unidades:", await response.json());
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
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
        console.error(
          "Error al obtener las descripciones:",
          await response.json()
        );
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  handleSubmit = (e) => {
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
    onClose();
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
        const errorData = await response.json();
        console.error("Error al registrar el producto:", errorData);
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
        throw new Error("Error al guardar la unidad en la base de datos");
      }
    } catch (error) {
      console.error("Hubo un error:", error);
      alert("No se pudo guardar la unidad. Inténtalo de nuevo.");
    }
    fetchUnit();
    fetchDescriptionByUnit(unitData.unitName);
    setOpenModalUnit(false);
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
          <form className="productFormModal" onSubmit={handleSubmit}>
            <div className="productFormModal-section">
              <h3>Información del producto</h3>
              <div className="productFormModal-row">
                <div className="productFormModal-item">
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
                <div className="productFormModal-item">
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
              <div className="productFormModal-row">
                <div className="productFormModal-item">
                  <label>
                    Categoría <span className="red">*</span>
                  </label>
                  <select
                    name="category"
                    value={product.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value={CATEGORY_PRODUCT.PERISHABLE}>
                      Perecedero
                    </option>
                    <option value={CATEGORY_PRODUCT.NON_PERISHABLE}>
                      No Perecedero
                    </option>
                  </select>
                </div>
                <div className="productFormModal-item">
                  <label>
                    Uso <span className="red">*</span>
                  </label>
                  <select
                    name="use"
                    value={product.use}
                    onChange={handleInputChange}
                    required
                  >
                    <option value={USE_PRODUCTS.SUPPLEMENTS}>
                      Suplementos
                    </option>
                    <option value={USE_PRODUCTS.HOMEOPATHIC}>
                      Homeopáticos
                    </option>
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
              <div className="productFormModal-row">
                <div className="productFormModal-item">
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
                <div className="productFormModal-item">
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
              <div className="productFormModal-row">
                <div className="productFormModal-item">
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
                <div className="productFormModal-item">
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
              <div className="productFormModal-row">
                <div className="productFormModal-item">
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
                <div className="productFormModal-item">
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
              className="product-buttonModal"
            >
              {BUTTONS_ACTIONS.REGISTRAR.charAt(0).toUpperCase() +
                BUTTONS_ACTIONS.REGISTRAR.slice(1)}
            </button>

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
      </div>
    )
  );
};

export default RegisterProductModal;
