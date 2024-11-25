import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../../Assets/logo2.png";
import Header from "../Header/Header";
import CustomModal from "../../Modales/CustomModal";
import "./ModifyProducts.css";
import {
  USE_PRODUCTS,
  CATEGORY_PRODUCT,
  BUTTONS_ACTIONS,
  SERVICES,
  ENTITIES,
} from "../../Constants/Constants";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";

const ModidyProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [send, setSend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [entity, setEntity] = useState("producto");
  const [action, setAction] = useState("modificar");
  const [sendProduct, setSendProduct] = useState({
    idProduct: id,
    productName: "",
    brand: "",
    category: CATEGORY_PRODUCT.PERISHABLE,
    use: USE_PRODUCTS.SUPPLEMENTS,
    idProvider: "",
    description: "",
    unitDTO: {
      unitName: "",
      description: "",
    },
    minimumProductAmount: "",
    maximumProductAmount: "",
  });

  const fillProduct = (dataProduct) => {
    setSendProduct(dataProduct);
  };

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = `${SERVICES.GET_PRODUCT_BY_ID_SERVICE}/${id}`;

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
          fillProduct(data);
        } else {
          setLoading(false);
          console.error("Error al traer el producto:", await response.json());
        }
      } catch (error) {
        setLoading(false);
        console.error("Error en la solicitud:", error);
      }
    };

    fetchProductById();
  }, [id]);

  useEffect(() => {
    const fetchProviderById = async () => {
      try {
        const token = localStorage.getItem("token");
        const idProv = sendProduct.idProvider;
        const url = `${SERVICES.GET_PROVIDER_BY_ID}/${idProv}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProvider(`${data.personDTO.firstName} ${data.personDTO.lastName}`);
        } else {
          console.error("Error al traer el producto:", await response.json());
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };
    fetchProviderById();
  }, [sendProduct.idProvider]);

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
      const url = `${SERVICES.MODIFY_PRODUCT_SERVICE}/${id}`;
      const method = "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sendProduct),
      });

      if (response.ok) {
        handleModalOpen({
          selectedEntity: ENTITIES.PRODUCTO,
          selectedAction: BUTTONS_ACTIONS.MODIFICAR,
          success: true,
        });
        setLoading(false);
      } else {
        const errorData = await response.json();
        console.error("Error al modificar el producto:", errorData);
      }
    } catch (error) {
      handleModalOpen({
        selectedEntity: ENTITIES.PRODUCTO,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSendProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));

    //Validaciones para que la cantidad minima sea menor que la de cantidad maxima
    if (name === "minimumProductAmount" || name === "maximumProductAmount") {
      const minAmount =
        name === "minimumProductAmount"
          ? value
          : sendProduct.minimumProductAmount;
      const maxAmount =
        name === "maximumProductAmount"
          ? value
          : sendProduct.maximumProductAmount;

      if (parseInt(minAmount, 10) >= parseInt(maxAmount, 10)) {
        setTooltipOpen(true);
      } else {
        setTooltipOpen(false);
      }
    }
  };

  const handleModalClose = () => {
    setSendProduct({
      idProduct: "",
      productName: "",
      brand: "",
      category: CATEGORY_PRODUCT.PERISHABLE,
      use: USE_PRODUCTS.SUPPLEMENTS,
      idProvider: "",
      description: "",
      unitDTO: {
        unitName: "",
        description: "",
      },
      minimumProductAmount: "",
      maximumProductAmount: "",
    });
    setOpenModal(false);
    setSend(false);
    navigate("/productos");
  };

  return (
    <div className="product-section-container">
      <Header pageTitle="Productos - Modificar" />
      <div>
        <div className="product-section">
          <label className="product-section-title">Modificar Producto</label>
        </div>
        <div className="steps-section">
          <div className="stepTwo-title-left">
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
                value={sendProduct.idProduct}
                onChange={handleInputChange}
                disabled
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
                value={sendProduct.productName}
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
                value={sendProduct.category}
                onChange={handleInputChange}
                disabled
                required
              >
                <option>{sendProduct.category}</option>
              </select>
            </div>
            <div className="productForm-item">
              <label>
                Uso <span className="red">*</span>
              </label>
              <select
                name="use"
                value={sendProduct.use}
                onChange={handleInputChange}
                disabled
                required
              >
                <option>{sendProduct.use}</option>
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
                  value={sendProduct.unitName}
                  onChange={handleInputChange}
                  disabled
                  required
                >
                  <option>{sendProduct.unitDTO.unitName}</option>
                </select>
              </div>
            </div>
            <div className="productForm-item">
              <label>
                Descripción de la unidad <span className="red">*</span>
              </label>
              <div className="unit-container">
                <select
                  name="descriptionUnit"
                  value={sendProduct.descriptionUnit}
                  onChange={handleInputChange}
                  disabled
                  required
                >
                  <option>{sendProduct.unitDTO.description}</option>
                </select>
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
                  value={sendProduct.minimumProductAmount}
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
                  value={sendProduct.maximumProductAmount}
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
                value={sendProduct.brand}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="productForm-item">
              <label>Detalles del producto</label>
              <textarea
                className="custom-textarea"
                name="description"
                value={sendProduct.description}
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
          {BUTTONS_ACTIONS.MODIFICAR.charAt(0).toUpperCase() +
            BUTTONS_ACTIONS.MODIFICAR.slice(1)}
        </button>
        <img src={logo} alt="logo" className="product-logo" />
        {/* Componente del modal */}
        <CustomModal
          entity={entity}
          action={action}
          openModal={openModal}
          onClose={handleModalClose}
        />
      </form>
    </div>
  );
};

export default ModidyProducts;
