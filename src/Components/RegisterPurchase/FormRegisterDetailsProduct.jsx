import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../../Assets/logo2.png";
import Header from "../Header/Header";
import "./FormRegisterDetailsProduct.css";
import {
  BUTTONS_ACTIONS,
  SERVICES,
  CATEGORY_PRODUCT,
} from "../../Constants/Constants";
import PurchaseModal from "../../Modales/PurchaseModal";
import CalendarModal from "../../Modales/CalendarModal";
import VerifyPurchaseModal from "../../Modales/VerifyPurchaseModal";
import { ButtonContext } from "../../Context/ButtonContext";
import { ProductContext } from "../../Context/ProductContext";

const RegisterProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState("");
  const [idProvider, setIdProvider] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const { setIsButtonActive } = useContext(ButtonContext);
  const [loading, setLoading] = useState(false);
  const [messageModal, setMessageModal] = useState("");
  const { sendProducts, addProduct, addProductTable } =
    useContext(ProductContext);
  // Estado del producto
  const [product, setProduct] = useState({
    idProduct: id,
    productName: "",
    category: "",
    use: "",
  });

  // Estado del producto a enviar
  const [sendProduct, setSendProduct] = useState({
    idProduct: id,
    batchPurchase: "",
    quantityPurchased: "",
    purchasePrice: "",
    salePrice: "",
    iva: "",
    purchaseDueDate: "",
  });

  // Fetch del producto por ID
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
          const data = await response.json();
          setProduct({
            productName: data.productName,
            category: data.category,
            use: data.use,
          });
          setIdProvider(data.idProvider);
        } else {
          console.error("Error al traer el producto:", await response.json());
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };
    fetchProductById();
  }, [id]);

  // Fetch del proveedor por ID
  useEffect(() => {
    const fetchProviderById = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = `${SERVICES.GET_PROVIDER_BY_ID}/${idProvider}`;
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
          console.error("Error al traer el proveedor:", await response.json());
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };
    if (idProvider) {
      fetchProviderById();
    }
  }, [idProvider]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProduct = {
      idProduct: sendProduct.idProduct,
      quantityPurchased: sendProduct.quantityPurchased,
      purchasePrice: sendProduct.purchasePrice,
      salePrice: sendProduct.salePrice,
      iva: sendProduct.iva,
      batchPurchase: sendProduct.batchPurchase,
      purchaseDueDate: sendProduct.purchaseDueDate,
    };

    const productTable = {
      idProduct: sendProduct.idProduct,
      productName: product.productName,
      category: product.category,
      use: product.use,
      purchasePrice: sendProduct.purchasePrice,
      quantityPurchased: sendProduct.quantityPurchased,
      iva: sendProduct.iva,
    };

    const auxProductList = [
      ...sendProducts.map((product) => ({
        idProduct: product.idProduct,
        quantityPurchased: product.quantityPurchased,
        salePrice: product.salePrice,
        batchPurchase: product.batchPurchase,
        purchaseDueDate: product.purchaseDueDate,
      })),
      {
        idProduct: newProduct.idProduct,
        quantityPurchased: newProduct.quantityPurchased,
        salePrice: newProduct.salePrice,
        batchPurchase: newProduct.batchPurchase,
        purchaseDueDate: newProduct.purchaseDueDate,
      },
    ];

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(SERVICES.VALIDATE_PURCHASE_SERVICE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(auxProductList),
      });

      const result = await response.json();

      if (result.message === "Compra valida") {
        addProduct(newProduct);
        addProductTable(productTable);
        setIsModalOpen(true);
      } else {
        setIsDuplicateModalOpen(true);
        setMessageModal(`El lote del producto ${id} ya existe`);
      }
    } catch (error) {
      console.error("Error en la solicitud de verificación:", error);
    }
  };

  const handleServiceAddPurchase = async (selectedDate) => {
    try {
      const token = localStorage.getItem("token");

      const purchaseData = {
        providerId: idProvider,
        purchaseDate: selectedDate,
        purchaseDetails: sendProducts,
      };

      const response = await fetch(SERVICES.ADD_PURCHASE_SERVICE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(purchaseData),
      });

      if (response.ok) {
        const dataPurchase = await response.json();
        setLoading(false);
        setIsCalendarOpen(false);
        setIsButtonActive(false);
        const purchaseID = dataPurchase.purchaseId;
        const pruchaseDate = dataPurchase.purchaseDate;
        const purchaseDetails = dataPurchase.purchaseDetails;
        const providerDTO = dataPurchase.providerDTO;
        navigate("/compra/factura", {
          state: { purchaseID, pruchaseDate, purchaseDetails, providerDTO },
        });
      } else {
        const errorData = await response.json();
        console.error("Error al registrar la compra:", errorData);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleSelectDate = () => {
    setIsModalOpen(false);
    setIsCalendarOpen(true);
    setLoading(true);
  };

  const handleAddAnother = () => {
    setIsModalOpen(false);
    setIsButtonActive(true);
    navigate(`/compra/productos/${idProvider}`);
  };

  const handleCalendarConfirm = async (selectedDate) => {
    await handleServiceAddPurchase(selectedDate);
  };

  const handleCalendarCancel = () => {
    setIsCalendarOpen(false);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSendProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  return (
    <div className="product-section-container">
      <Header pageTitle="Registrar Compra" />
      <div className="steps-section">
        <div className="stepTwo-title-left">
          <label className="step-by-step">Paso 3 de 3</label>
          <label className="step-information-2">Información de la compra</label>
          <label>Proveedor: {provider}</label>
        </div>
      </div>
      <form className="productForm" onSubmit={handleSubmit}>
        <div className="productForm-section">
          <div className="productForm-row">
            <div className="productForm-item">
              <label>
                Identificador del producto <span className="red">*</span>
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
                Nombre del producto <span className="red">*</span>
              </label>
              <input
                type="text"
                name="productName"
                value={product.productName}
                onChange={handleInputChange}
                disabled
                required
              />
            </div>
          </div>
          <div className="productForm-row">
            <div className="productForm-item">
              <label htmlFor="date-picker">
                Lote (fecha) <span className="red">*</span>
              </label>
              <input
                className="calenar-input-form-product"
                type="date"
                name="batchPurchase"
                value={sendProduct.batchPurchase}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="productForm-item">
              <label>
                Cantidad <span className="red">*</span>
              </label>
              <input
                type="number"
                name="quantityPurchased"
                value={sendProduct.quantityPurchased}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
          </div>
          <div className="productForm-row">
            <div className="productForm-item">
              <label>
                Precio Unitario de entrada <span className="red">*</span>
              </label>
              <input
                type="number"
                name="purchasePrice"
                value={sendProduct.purchasePrice}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
            <div className="productForm-item">
              <label>
                Precio Unitario de salida <span className="red">*</span>
              </label>
              <input
                type="number"
                name="salePrice"
                value={sendProduct.salePrice}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
          </div>
          <div className="productForm-row">
            {product.category !== CATEGORY_PRODUCT.NON_PERISHABLE && (
              <div className="productForm-item">
                <label htmlFor="date-picker">
                  Fecha de vencimiento <span className="red">*</span>
                </label>
                <input
                  className="calenar-input-form-product"
                  type="date"
                  name="purchaseDueDate"
                  value={sendProduct.purchaseDueDate}
                  onChange={handleInputChange}
                  min={
                    new Date(new Date().setDate(new Date().getDate()))
                      .toISOString()
                      .split("T")[0]
                  }
                  required
                />
              </div>
            )}
            <div className="productForm-item">
              <label>
                Porcentaje del IVA <span className="red">*</span>
              </label>
              <input
                type="number"
                name="iva"
                value={sendProduct.iva}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
          </div>
        </div>
        <button type="submit" className="provider-button">
          {BUTTONS_ACTIONS.ANADIR.charAt(0).toUpperCase() +
            BUTTONS_ACTIONS.ANADIR.slice(1)}
        </button>
        <img src={logo} alt="logo" className="product-logo" />
        {/* Componente del modal */}
        <PurchaseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectDate={handleSelectDate}
          onAddAnother={handleAddAnother}
        />
        <VerifyPurchaseModal
          isOpen={isDuplicateModalOpen}
          onClose={() => setIsModalOpen(false)}
          message={messageModal}
          onNavigate={handleAddAnother}
        />
        <CalendarModal
          isOpen={isCalendarOpen}
          onClose={handleCalendarCancel}
          onConfirm={handleCalendarConfirm}
          onLoading={loading}
        />
      </form>
    </div>
  );
};

export default RegisterProduct;
