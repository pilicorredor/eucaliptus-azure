import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomTable from "../CustomTable/CustomTable.jsx";
import SearchIcon from "@mui/icons-material/Search";
import "./ChooseProductsPurchase.css";
import Header from "../Header/Header.jsx";
import {
  SERVICES,
  CATEGORY_PRODUCT,
  ENTITIES,
} from "../../Constants/Constants.js";
import { ButtonContext } from "../../Context/ButtonContext";
import Dropdown from "../Dropdown/Dropdown.jsx";
import DropdownItem from "../DropdownItem/DropdownItem.jsx";
import { ProductContext } from "../../Context/ProductContext";
import RegisterProductModal from "../../Modales/RegisterProductModal.jsx";
import CalendarModal from "../../Modales/CalendarModal";
import CircularProgress from "@mui/material/CircularProgress";

const ChooseProductsPurchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryProd, setCategoryProd] = useState(
    CATEGORY_PRODUCT.ALL_PRODUCTS
  );
  const [productsData, setProductsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [useButtonText, setUseButtonText] = useState("TODOS");
  const [productButtonText, setProductButtonText] = useState("Buscar por...");
  const [selectedUseFilter, setSelectedUseFilter] = useState("");
  const [selectedSearchFilter, setSelectedSearchFilter] = useState("");
  const [contextTable] = useState("registerPurchaseAddProd");
  const { isButtonActive, setIsButtonActive } = useContext(ButtonContext);
  const [loading, setLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [provider, setProvider] = useState("");
  const { sendProducts, clearProducts } = useContext(ProductContext);

  
  const columnsProducts = [
    "idProduct",
    "productName",
    "brand",
    "categoryProduct",
    "useProduct",
    "unitName",
    "unitDescription",
  ];

  useEffect(() => {
    fetchProductsData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          const providerName = `${data.personDTO.firstName} ${data.personDTO.lastName}`;
          setProvider(providerName);
        } else {
          setLoading(false);

          console.error("Error al traer el vendedor:", await response.json());
        }
      } catch (error) {
        setLoading(false);

        console.error("Error en la solicitud:", error);
      }
    };

    fetchProviderById();
  }, [id]);

  const fetchProductsData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${SERVICES.GET_PRODUCT_BY_PROVIDER_SERVICE}/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setLoading(false);
        const data = await response.json();
        const formattedProducts = data.map((product) => ({
          id_modify: product.idProduct,
          idProduct: product.idProduct,
          productName: product.productName,
          brand: product.brand,
          categoryProduct: product.category,
          useProduct: product.use,
          idProvider: product.idProvider,
          unitName: product.unitDTO.unitName,
          unitDescription: product.unitDTO.description,
          minimumProductAmount: product.minimumProductAmount,
          maximumProductAmount: product.maximumProductAmount,
        }));
        setProductsData(formattedProducts);
        setFilteredData(formattedProducts);
      } else {
        setLoading(false);

        const errorMessage = await response.text();
        console.error("Error al obtener los productos:", errorMessage);
      }
    } catch (error) {
      setLoading(false);

      console.error("Error en la solicitud de productos:", error);
    }
  };

  const availableUses = [
    "TODOS",
    "SUPLEMENTOS",
    "HOMEOPATICOS",
    "FITOTERAPEUTICOS",
    "ESPECIAS",
    "ESOTERICOS",
    "CUIDADO_PERSONAL",
    "OTROS",
  ];

  const productItems = [
    "Todos",
    "ID del producto",
    "Nombre",
    "Marca",
    "Categoría",
    "Uso",
    "Unidad",
    "Descripción unidad",
  ];

  const columnMap = {
    "ID del producto": "idProduct",
    "Nombre": "productName",
    "Marca": "brand",
    "Categoría": "categoryProduct",
    "Uso": "useProduct",
    "Unidad": "unitName",
    "Descripción unidad": "unitDescription",
  };

  useEffect(() => {
    handleUpdateData(categoryProd, selectedUseFilter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryProd, selectedUseFilter, productsData]);

  const handleCategoryChange = (selectedCategory) => {
    setCategoryProd(selectedCategory);
  };

  const handleSearch = () => {
    if (!searchQuery || selectedSearchFilter === "Todos") {
      
      setFilteredData(productsData);
      return;
    }

    const selectedColumn = columnMap[selectedSearchFilter];

    if (!selectedColumn) {
      console.warn("No se ha seleccionado una columna válida para la búsqueda.");
      return;
    }

    const filteredResults = productsData.filter((product) =>
      product[selectedColumn]
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    setFilteredData(filteredResults);
  };

  const handleUpdateData = (categoryProd, selectedUse) => {
    let filteredProducts = productsData;

    if (categoryProd !== CATEGORY_PRODUCT.ALL_PRODUCTS) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          (categoryProd === CATEGORY_PRODUCT.PERISHABLE &&
            product.categoryProduct === "PERECEDERO") ||
          (categoryProd === CATEGORY_PRODUCT.NON_PERISHABLE &&
            product.categoryProduct === "NO_PERECEDERO")
      );
    }

    if (selectedUse && selectedUse !== "TODOS") {
      filteredProducts = filteredProducts.filter(
        (product) => product.useProduct === selectedUse
      );
    }
    setFilteredData(filteredProducts);
  };

  const handleServiceAddPurchase = async (selectedDate) => {
    try {
      const token = localStorage.getItem("token");

      const purchaseData = {
        providerId: id,
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
        console.log("dataPurchase.providerDTO: ", dataPurchase.providerDTO);
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

  const handleCalendarConfirm = async (selectedDate) => {
    await handleServiceAddPurchase(selectedDate);
  };

  const handleCalendarCancel = () => {
    setIsCalendarOpen(false);
    setIsModalOpen(true);
  };

  const handleUseFilterSelection = (selectedItem) => {
    setSelectedUseFilter(selectedItem);
    setUseButtonText(selectedItem);
  };

  const handleSearchFilterSelection = (selectedItem) => {
    setSelectedSearchFilter(selectedItem);
    setProductButtonText(selectedItem);

    if (selectedItem === "Todos") {
      setSearchQuery("");
      setFilteredData(productsData);
    }
  };

  const handleFinishPurchase = () => {
    setIsButtonActive(false);
    handleSelectDate();
    handleServiceAddPurchase();
  };

  const handleClearProducts = () => {
    clearProducts();
    setIsButtonActive(false);
    navigate("/compra/proveedor");
  };

  const handleNewButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchProductsData();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  return (
    <div className="products">
      <Header pageTitle="Registrar Compra" />
      <div>
        <div className="steps-section">
          <div className="stepTwo-title-left">
            <label className="step-by-step">Paso 2 de 3</label>
            <label className="step-information-2">
              Seleccionar producto a agregar
            </label>
          </div>
          <div className="stepTwo-title-right">
            <label>Proveedor: {provider}</label>
            {!isButtonActive && (
              <button
                className="change-btn"
                onClick={() => navigate("/compra/proveedor")}
              >
                Cambiar
              </button>
            )}
          </div>
        </div>
        <div className="products-header">
          <button
            onClick={() => handleCategoryChange(CATEGORY_PRODUCT.ALL_PRODUCTS)}
            className={
              categoryProd === CATEGORY_PRODUCT.ALL_PRODUCTS ? "selected" : ""
            }
          >
            Todos
          </button>
          <button
            onClick={() => handleCategoryChange(CATEGORY_PRODUCT.PERISHABLE)}
            className={
              categoryProd === CATEGORY_PRODUCT.PERISHABLE ? "selected" : ""
            }
          >
            Perecederos
          </button>
          <button
            onClick={() =>
              handleCategoryChange(CATEGORY_PRODUCT.NON_PERISHABLE)
            }
            className={
              categoryProd === CATEGORY_PRODUCT.NON_PERISHABLE ? "selected" : ""
            }
          >
            No Perecederos
          </button>
        </div>

        <div className="search-bar">
          <div className="search-container">
            <Dropdown
              buttonText={productButtonText}
              content={
                <>
                  {" "}
                  {productItems.map((item) => (
                    <DropdownItem
                      key={item}
                      onClick={() => handleSearchFilterSelection(item)}
                    >
                      {`${item}`}
                    </DropdownItem>
                  ))}{" "}
                </>
              }
            />
            <input
              type="text"
              placeholder="Ingresa tu búsqueda"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <SearchIcon className="search-icon" />
            <button className="btn search-btn" onClick={handleSearch}>
              Buscar
            </button>
          </div>
          <button className="btn new-btn" onClick={handleNewButtonClick}>
            Nuevo
          </button>
        </div>

        {/* Nuevo filtro por uso */}
        <div className="filter-use">
          <label>Filtrar por:</label>
          <Dropdown
            buttonText={useButtonText}
            content={
              <>
                {" "}
                {availableUses.map((item) => (
                  <DropdownItem
                    key={item}
                    onClick={() => handleUseFilterSelection(item)}
                  >
                    {`${item}`}
                  </DropdownItem>
                ))}{" "}
              </>
            }
          />
        </div>

        <div className="products-content">
        {loading && (
            <div className="loading-container">
              <CircularProgress className="loading-icon" />
            </div>
          )}
          <CustomTable
            data={filteredData}
            customColumns={columnsProducts}
            handleUpdateData={handleUpdateData}
            role={ENTITIES.PRODUCTO}
            fetchProductsData={fetchProductsData}
            context={contextTable}
          />
        </div>
      </div>
      {/* Botón "Terminar compra" solo si isButtonActive es true */}
      {isButtonActive && (
        <div className="finish-purchase-btn-container">
          <button className="cancel-purchase-btn" onClick={handleClearProducts}>
            Cancelar compra
          </button>
          <button
            className="finish-purchase-btn"
            onClick={handleFinishPurchase}
          >
            Terminar compra
          </button>
        </div>
      )}
      {/* Modal de Proveedor */}
      <RegisterProductModal
        id={id}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        handleSubmit={handleSubmit}
      />
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={handleCalendarCancel}
        onConfirm={handleCalendarConfirm}
        onLoading={loading}
      />
    </div>
  );
};

export default ChooseProductsPurchase;
