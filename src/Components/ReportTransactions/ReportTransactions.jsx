import React, { useState, useEffect } from "react";
import CustomTable from "../CustomTable/CustomTable.jsx";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../Header/Header.jsx";
import { SERVICES, REPORT_TRANSACTION } from "../../Constants/Constants.js";
import Dropdown from "../Dropdown/Dropdown.jsx";
import DropdownItem from "../DropdownItem/DropdownItem.jsx";
import "./ReportTransactions.css";
import CircularProgress from "@mui/material/CircularProgress";
import FailModal from "../../Modales/FailModal.jsx"

const ReportTransactions = () => {
  const [typeTransaction, setTypeTransaction] = useState(
    REPORT_TRANSACTION.SALE
  );
  const [productsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [range, setRange] = useState({ start: "", end: "" });
  const [productButtonText, setProductButtonText] = useState("Buscar por...");
  const [selectedUseFilter] = useState("");
  const [selectedSearchFilter, setSelectedSearchFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [purchasesData, setPurchasesData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageFail, setMessageFail] = useState("");

  const columnsSale = ["idSale", "idSeller", "nameClient", "total"];
  const columnsPurchase = ["purchaseId", "providerId", "totalPurchase"];

  const saleItems = ["Todos", "ID Factura", "ID Vendedor", "Cliente", "Total"];
  const purchaseItems = ["Todos", "ID Factura", "ID Proveedor", "Total"];

  const columnSaleMap = {
    "ID Factura": "idSale",
    "ID Vendedor": "idSeller",
    "Cliente": "nameClient",
    "Total": "total"
  }

  const columnPurchaseMap = {
    "ID Factura": "purchaseId",
    "ID Proveedor": "providerId",
    "Total": "totalPurchase"
  }

  useEffect(() => {
    handleUpdateData(typeTransaction, selectedUseFilter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeTransaction, selectedUseFilter, productsData]);

  const handleReportChange = (selectedPeriod) => {
    setTypeTransaction(selectedPeriod);
    setRange({ start: "", end: "" });
    setSelectedDate("");
  };

  const handleDateChange = (event) => {
    const selected = event.target.value;
    setSelectedDate(selected);
    setRange({ startDate: selected });
  };

  const handleSearchRange = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    let url = "";
    if (typeTransaction === REPORT_TRANSACTION.SALE) {
      url = `${SERVICES.GET_HISTORY_SALE_SERVICE}`;
    } else if (typeTransaction === REPORT_TRANSACTION.PURCHASE) {
      url = `${SERVICES.GET_HISTORY_PURCHASE_SERVICE}`;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(range),
      });

      if (response.ok) {
        const data = await response.json();
        let transformedData = null;
        if (typeTransaction === REPORT_TRANSACTION.SALE) {
          transformedData = data.map((item) => ({
            id_modify: item.idSale,
            ...item,
            ...item.clientDTO,
          }));
        } else {
          transformedData = data.map((item) => ({
            id_modify: item.purchaseId,
            ...item,
          }));
        }

        if (typeTransaction === REPORT_TRANSACTION.SALE) {
          setSalesData(transformedData);
        } else {
          setPurchasesData(transformedData);
        }
        setFilteredData(transformedData);
        setLoading(false);
      } else {
        console.error("Error al obtener los reportes:", await response.json());
        setLoading(false);
        setMessageFail("No fue posible obtener los reportes");
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setLoading(false);
      setMessageFail("Error en la solicitud");
      setIsModalOpen(true);
    }
  };

  const handleSearch = () => {
    if (typeTransaction === REPORT_TRANSACTION.SALE) {
      if (!searchQuery || selectedSearchFilter === "Todos") {

        setFilteredData(salesData);
        return;
      }
      const selectedColumn = columnSaleMap[selectedSearchFilter];

      if (!selectedColumn) {
        console.warn("No se ha seleccionado una columna válida para la búsqueda.");
        return;
      }

      const filteredResults = salesData.filter((sale) =>
        sale[selectedColumn]
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );

      setFilteredData(filteredResults);
    } else {
      if (!searchQuery || selectedSearchFilter === "Todos") {

        setFilteredData(purchasesData);
        return;
      }
      const selectedColumn = columnPurchaseMap[selectedSearchFilter];

      if (!selectedColumn) {
        console.warn("No se ha seleccionado una columna válida para la búsqueda.");
        return;
      }

      const filteredResults = purchasesData.filter((purchase) =>
        purchase[selectedColumn]
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );

      setFilteredData(filteredResults);
    }
  };

  const handleSearchFilterSelection = (selectedItem) => {
    setSelectedSearchFilter(selectedItem);
    setProductButtonText(selectedItem);

    if (selectedItem === "Todos") {
      setSearchQuery("");
      if (typeTransaction === REPORT_TRANSACTION.SALE) {
        setFilteredData(salesData);
      } else {
        setFilteredData(purchasesData);
      }
    }
  };

  const handleUpdateData = (typeTransaction) => {
    let filteredProducts = productsData;
    setFilteredData(filteredProducts);
  };

  return (
    <div className="reports-transaction">
      <Header pageTitle="Reporte de Movimientos" />
      <div>
        <div className="reports-header">
          <button
            onClick={() => handleReportChange(REPORT_TRANSACTION.SALE)}
            className={
              typeTransaction === REPORT_TRANSACTION.SALE ? "selected" : ""
            }
          >
            Ventas
          </button>
          <button
            onClick={() => handleReportChange(REPORT_TRANSACTION.PURCHASE)}
            className={
              typeTransaction === REPORT_TRANSACTION.PURCHASE ? "selected" : ""
            }
          >
            Compras
          </button>
        </div>

        <div className="calendar-container-t">
          <div className="calendar-input-container-t">
            <label htmlFor="date-picker-t">Escoger Fecha Inicial:</label>
            <input
              type="date"
              name="selectedDate"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
          {selectedDate && (
            <button className="btn search-btn" onClick={handleSearchRange}>
              Buscar
            </button>
          )}
        </div>

        {loading && (
          <div className="page-loading-container">
            <CircularProgress className="page-loading-icon" />
          </div>
        )}

        <div className="search-bar">
          <div className="search-container">
            <Dropdown
              buttonText={productButtonText}
              content={
                <>
                  {(typeTransaction === REPORT_TRANSACTION.SALE
                    ? saleItems
                    : purchaseItems
                  ).map((item) => (
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

        <div className="reports-content">
          <FailModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            message={messageFail} />
          {filteredData.length === 0 && (
            <p className="no-data-message">
              No hay registros en el tiempo seleccionado
            </p>
          )}
          <CustomTable
            data={filteredData}
            customColumns={
              typeTransaction === REPORT_TRANSACTION.SALE
                ? columnsSale
                : columnsPurchase
            }
            handleUpdateData={handleUpdateData}
            context={typeTransaction}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportTransactions;
