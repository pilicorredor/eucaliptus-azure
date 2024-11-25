import React, { useState, useEffect } from "react";
import CustomTable from "../CustomTable/CustomTable.jsx";
import SearchIcon from "@mui/icons-material/Search";
import "./ChooseProviderPurchase.css";
import Header from "../Header/Header.jsx";
import Dropdown from "../Dropdown/Dropdown.jsx";
import DropdownItem from "../DropdownItem/DropdownItem.jsx";
import { SERVICES, ENTITIES } from "../../Constants/Constants.js";
import RegisterProviderModal from "../../Modales/RegisterProviderModal";
import CircularProgress from "@mui/material/CircularProgress";

const ChooseProviderPurchase = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role] = useState("proveedor");
  const [contextTable] = useState("registerPurchase");
  const [searchQuery, setSearchQuery] = useState("");
  const [providersData, setProvidersData] = useState([]);
  const [buttonText, setButtonText] = useState("Buscar por...");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchProvidersData();
  }, []);

  const fetchProvidersData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(SERVICES.GET_PROVIDERS_ALL_SERVICE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setLoading(false);
        const data = await response.json();
        const formattedProviders = data.map((provider) => ({
          id_modify: provider.personDTO.idPerson,
          name: `${provider.personDTO.firstName} ${provider.personDTO.lastName}`,
          addressCompany: provider.companyDTO?.companyAddress || "N/A",
          email: provider.personDTO.email,
          phoneNumber: provider.personDTO.phoneNumber,
          companyName: provider.companyDTO?.companyName || "N/A",
          bankAccount: provider.bankAccountNumber,
        }));
        setProvidersData(formattedProviders);
        setFilteredData(formattedProviders);
      } else {
        setLoading(false);
        const errorMessage = await response.text();
        console.error("Error al obtener los vendedores:", errorMessage);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error en la solicitud de vendedores:", error);
    }
  };

  const columnsProviders = [
    "id_modify",
    "name",
    "addressCompany",
    "email",
    "phoneNumber",
    "companyName",
    "bankAccount",
  ];

  const providerItems = [
    "Todos",
    "ID",
    "Nombre",
    "Dirección Empresarial",
    "Correo Electrónico",
    "Número de Teléfono",
    "Nombre de la Empresa",
    "Cuenta Bancaria",
  ];

  const columnMap = {
    "ID": "id_modify",
    "Nombre": "name",
    "Dirección Empresarial": "addressCompany",
    "Correo Electrónico": "email",
    "Número de Teléfono": "phoneNumber",
    "Nombre de la Empresa": "companyName",
    "Cuenta Bancaria": "companyName",
  };

  const handleSearch = () => {
    if (!searchQuery || selectedFilter === "Todos") {

      setFilteredData(providersData);
      return;
    }

    const selectedColumn = columnMap[selectedFilter];

    if (!selectedColumn) {
      console.warn("No se ha seleccionado una columna válida para la búsqueda.");
      return;
    }

    const filteredResults = providersData.filter((provider) =>
      provider[selectedColumn]
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    setFilteredData(filteredResults);
  };

  const handleFilterSelection = (selectedItem) => {
    setSelectedFilter(selectedItem);
    setButtonText(selectedItem);


    if (selectedItem === "Todos") {
      setSearchQuery("");
      setFilteredData(providersData);
    }
  };

  const handleNewButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchProvidersData();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  return (
    <div className="products">
      <Header pageTitle="Registrar Compra" />
      <div>
        <div className="steps-section-1">
          <label className="step-by-step">Paso 1 de 3</label>
          <label className="step-information">Seleccionar proveedor</label>
        </div>
        <div className="search-bar">
          <div className="search-container">
            <Dropdown
              buttonText={buttonText}
              content={
                <>
                  {" "}
                  {providerItems.map((item) => (
                    <DropdownItem
                      key={item}
                      onClick={() => handleFilterSelection(item)}
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

        <div className="products-content">
          {loading && (
            <div className="loading-container">
              <CircularProgress className="loading-icon" />
            </div>
          )}
          {role === ENTITIES.PROVEEDOR && (
            <CustomTable
              data={filteredData}
              customColumns={columnsProviders}
              role={role}
              context={contextTable}
            />
          )}
        </div>
        {/* Modal de Proveedor */}
        <RegisterProviderModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ChooseProviderPurchase;
