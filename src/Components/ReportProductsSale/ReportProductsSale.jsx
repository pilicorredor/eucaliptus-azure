import React, { useState, useEffect } from "react";
import CustomTable from "../CustomTable/CustomTable.jsx";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../Header/Header.jsx";
import { SERVICES, REPORT_PERIOD } from "../../Constants/Constants.js";
import Dropdown from "../Dropdown/Dropdown.jsx";
import DropdownItem from "../DropdownItem/DropdownItem.jsx";
import "./ReportProductsSale.css";
import CircularProgress from "@mui/material/CircularProgress";
import FailModal from "../../Modales/FailModal.jsx"


const ReportPage = () => {
  const [periodReport, setPeriodReport] = useState(REPORT_PERIOD.DAILY);
  const [productsData, setProductsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [range, setRange] = useState({ start: "", end: "" });
  const [productButtonText, setProductButtonText] = useState("Buscar por...");
  const [selectedSearchFilter, setSelectedSearchFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageFail, setMessageFail] = useState("");

  const columnsProducts = [
    "idProduct",
    "productName",
    "category",
    "use",
    "quantity",
    "totalPrice",
  ];

  const productItems = [
    "Todos",
    "ID del producto",
    "Nombre",
    "Categoría",
    "Uso",
    "Cantidad",
    "Sub Total",
  ];

  const columnMap = {
    "ID del producto": "idProduct",
    "Nombre": "productName",
    "Categoría": "category",
    "Uso": "use",
    "Cantidad": "quantity",
    "Sub Total": "totalPrice",
  }

  useEffect(() => {
    handleUpdateData(periodReport, selectedSearchFilter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodReport, selectedSearchFilter, productsData]);

  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleReportChange = (selectedPeriod) => {
    setPeriodReport(selectedPeriod);
    setRange({ start: "", end: "" });
    setSelectedDate("");
  };

  const handleDateChange = (event) => {
    const selected = event.target.value;
    setSelectedDate(selected);

    if (periodReport === REPORT_PERIOD.WEEKLY) {
      const start = new Date(selected);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      setRange({
        start: start.toISOString().split("T")[0],
        end: end.toISOString().split("T")[0],
      });
    } else if (periodReport === REPORT_PERIOD.MONTHLY) {
      const start = new Date(selected);
      const end = new Date(start);
      end.setDate(start.getDate() + 29);
      setRange({
        start: start.toISOString().split("T")[0],
        end: end.toISOString().split("T")[0],
      });
    } else {
      setRange({ start: selected, end: selected });
    }
  };

  const handleSearchRange = async () => {
    console.log("Buscar:", searchQuery, "Rango:", range);
    setLoading(true);

    const requestBody = {
      startDate: range.start,
      endDate: range.end,
    };

    const token = localStorage.getItem("token");

    let url = "";
    if (periodReport === REPORT_PERIOD.DAILY) {
      url = `${SERVICES.DAILY_REPORT_SERVICE}`;
    } else if (
      periodReport === REPORT_PERIOD.WEEKLY ||
      periodReport === REPORT_PERIOD.MONTHLY
    ) {
      url = `${SERVICES.RANGE_REPORT_SERVICE}`;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        const transformedData = data.map((item) => ({
          ...item,
          ...item.product,
        }));

        setProductsData(transformedData);
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

  const handleSearchFilterSelection = (selectedItem) => {
    setSelectedSearchFilter(selectedItem);
    setProductButtonText(selectedItem);

    if (selectedItem === "Todos") {
      setSearchQuery("");
      setFilteredData(productsData);
    }
  };

  const handleUpdateData = (periodReport) => {
    let filteredProducts = productsData;
    setFilteredData(filteredProducts);
  };

  return (
    <div className="reports-page">
      <Header pageTitle="Reporte Productos Vendidos" />
      <div>
        <div className="reports-header">
          <button
            onClick={() => handleReportChange(REPORT_PERIOD.DAILY)}
            className={periodReport === REPORT_PERIOD.DAILY ? "selected" : ""}
          >
            Diario
          </button>
          <button
            onClick={() => handleReportChange(REPORT_PERIOD.WEEKLY)}
            className={periodReport === REPORT_PERIOD.WEEKLY ? "selected" : ""}
          >
            Semanal
          </button>
          <button
            onClick={() => handleReportChange(REPORT_PERIOD.MONTHLY)}
            className={periodReport === REPORT_PERIOD.MONTHLY ? "selected" : ""}
          >
            Mensual
          </button>
        </div>

        <div className="calendar-container">
          <div className="calendar-input-container">
            <label htmlFor="date-picker">Escoger Fecha Inicial:</label>
            <input
              type="date"
              name="selectedDate"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
          <div>
            {periodReport === REPORT_PERIOD.DAILY && range.start && (
              <p>Fecha seleccionada: {formatDate(range.start)}</p>
            )}
            {periodReport !== REPORT_PERIOD.DAILY &&
              range.start &&
              range.end && (
                <p>
                  Rango seleccionado: {formatDate(range.start)} -{" "}
                  {formatDate(range.end)}
                </p>
              )}
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
            customColumns={columnsProducts}
            handleUpdateData={handleUpdateData}
            context={"report"}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
