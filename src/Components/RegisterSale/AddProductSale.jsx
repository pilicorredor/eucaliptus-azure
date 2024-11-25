import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomTableSale from "../CustomTableSale/CustomTableSale.jsx";
import SummaryTable from "../CustomTableSale/SummaryTable.jsx";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../Header/Header.jsx";
import { SERVICES } from "../../Constants/Constants.js";
import Dropdown from "../Dropdown/Dropdown.jsx";
import DropdownItem from "../DropdownItem/DropdownItem.jsx";
import "./AddProductSale.css";
import CircularProgress from "@mui/material/CircularProgress";
import FailModal from "../../Modales/FailModal.jsx"

const AddProductSale = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [productButtonText, setProductButtonText] = useState("Buscar por...");
  const [filteredData, setFilteredData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageFail, setMessageFail] = useState("");

  useEffect(() => {
    const fetchProductsData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(SERVICES.GET_STOCK_SERVICE, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setLoading(false);
          const data = await response.json();
          const formattedProducts = data.map((product) => ({
            id_modify: product.productDTO.idProduct,
            idProduct: product.productDTO.idProduct,
            productName: product.productDTO.productName,
            quantityAvailable: product.quantityAvailable,
            productSalePrice: product.productSalePrice,
            productSalePriceWithoutIVA: product.productSalePriceWithoutIVA,
            use: product.productDTO.use,
            iva: product.iva,
          }));
          setProductsData(formattedProducts);
          setFilteredData(formattedProducts);
        } else {
          setLoading(false);
          const errorMessage = await response.text();
          console.error("Error al obtener los productos:", errorMessage);
          setMessageFail("No fue posible obtener los productos");
          setIsModalOpen(true);

        }
      } catch (error) {
        setLoading(false);
        console.error("Error en la solicitud de productos:", error);
        setMessageFail("Error en la solicitud de productos");
        setIsModalOpen(true);
      }
    };

    fetchProductsData();
  }, []);

  const columnsProducts = [
    "idProduct",
    "productName",
    "quantityAvailable",
    "productSalePrice",
  ];
  const productItems = ["Todos", "ID del producto", "Nombre", "Cantidad", "Precio"];

  const columnMap = {
    "ID del producto": "idProduct",
    "Nombre": "productName",
    "Cantidad": "quantityAvailable",
    "Precio": "productSalePrice"
  }

  const handleSearch = () => {
    if (!searchQuery || selectedFilter === "Todos") {
      setFilteredData(productsData);
      return;
    }

    const selectedColumn = columnMap[selectedFilter];

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

  const handleSearchFilterSelection = (selectedItem) => {
    setSelectedFilter(selectedItem);
    setProductButtonText(selectedItem);

    if (selectedItem === "Todos") {
      setSearchQuery("");
      setFilteredData(productsData);
    }
  };

  const handleAddToSummary = (product, quantitySold) => {
    setSummaryData((prevSummary) => {
      const existingProduct = prevSummary.find(
        (item) => item.id_modify === product.id_modify
      );

      if (existingProduct) {
        return prevSummary.map((item) =>
          item.id_modify === product.id_modify
            ? {
              ...item,
              quantitySold: item.quantitySold + quantitySold,
              subTotal:
                item.productSalePrice * (item.quantitySold + quantitySold),
            }
            : item
        );
      }

      return [
        ...prevSummary,
        {
          id_modify: product.id_modify,
          idProduct: product.idProduct,
          productName: product.productName,
          use: product.use,
          productSalePrice: product.productSalePrice,
          productSalePriceWithoutIVA: product.productSalePriceWithoutIVA,
          quantitySold,
          iva: product.iva,
          subTotal: product.productSalePrice * quantitySold,
        },
      ];
    });

    // Actualiza la cantidad disponible en filteredData
    setFilteredData((prevFilteredData) =>
      prevFilteredData.map((item) =>
        item.id_modify === product.id_modify
          ? {
            ...item,
            quantityAvailable: item.quantityAvailable - quantitySold,
          }
          : item
      )
    );
  };

  const handleRemoveFromSummary = (id) => {
    const removedItem = summaryData.find((item) => item.id_modify === id);

    if (removedItem) {
      setSummaryData((prevSummaryData) =>
        prevSummaryData.filter((item) => item.id_modify !== id)
      );

      setFilteredData((prevFilteredData) =>
        prevFilteredData.map((item) =>
          item.id_modify === id
            ? {
              ...item,
              quantityAvailable:
                item.quantityAvailable + removedItem.quantitySold,
            }
            : item
        )
      );
    }
  };

  const handleNextSale = () => {
    navigate("/registrar-venta", { state: { summaryData } });
  };

  return (
    <div className="products-sale">
      <Header pageTitle="Nueva Venta" />
      <div>
        <div className="steps-section-sale">
          <label className="step-by-step">Paso 1 de 2</label>
          <label className="step-information">Seleccionar productos</label>
        </div>
        <div className="search-bar">
          <div className="search-container">
            <Dropdown
              buttonText={productButtonText}
              content={
                <>
                  {productItems.map((item) => (
                    <DropdownItem
                      key={item}
                      onClick={() => handleSearchFilterSelection(item)}
                    >
                      {`${item}`}
                    </DropdownItem>
                  ))}
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
        </div>

        <div className="products-sale-content">
          <FailModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            message={messageFail} />
          {loading && (
            <div className="loading-container">
              <CircularProgress className="loading-icon" />
            </div>
          )}
          <CustomTableSale
            widthTable={"70%"}
            dataProducts={filteredData}
            customColumns={columnsProducts}
            onAddToSummary={handleAddToSummary}
            isNewSale={true}
          />
          <SummaryTable
            summaryData={summaryData}
            onRemove={handleRemoveFromSummary}
          />
        </div>
        <div className="next-sale-btn-container">
          <button
            className="next-sale-btn"
            onClick={handleNextSale}
            disabled={summaryData.length === 0}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductSale;
