import React, { useState, useEffect } from "react";
import CustomTable from "../CustomTable/CustomTable";
import SearchIcon from "@mui/icons-material/Search";
import "./ChooseProvider.css";
import Header from "../Header/Header.jsx";
import { SERVICES, ENTITIES } from "../../Constants/Constants";
import FailModal from "../../Modales/FailModal.jsx"
import CircularProgress from "@mui/material/CircularProgress";

const ChooseProvider = () => {
  const [role] = useState("proveedor");
  const [contextTable] = useState("registerProd");
  const [searchQuery, setSearchQuery] = useState("");
  const [providersData, setProvidersData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageFail, setMessageFail] = useState("");
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
      } else {
        setLoading(false);
        setMessageFail("No fue posible obtener los vendedores");
        setIsModalOpen(true);
      }
    } catch (error) {
      setLoading(false);
      setMessageFail("Error en la solicitud de vendedores");
      setIsModalOpen(true);
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

  const handleSearch = () => {
    console.log("Buscar:", searchQuery);
  };

  return (
    <div className="products">
      <Header pageTitle="Productos - Registrar" />
      <div>
        <div className="products-section">
          <label className="sellerSection-title">Agregar Nuevo Producto</label>
        </div>
        <div className="steps-section-1">
          <label className="step-by-step">Paso 1 de 2</label>
          <label className="step-information">Seleccionar proveedor</label>
        </div>
        <div className="search-bar">
          <div className="search-container">
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

        <div className="products-content">
          {loading && (
            <div className="loading-container">
              <CircularProgress className="loading-icon" />
            </div>
          )}
          {role === ENTITIES.PROVEEDOR && (
            <CustomTable
              data={providersData}
              customColumns={columnsProviders}
              role={role}
              context={contextTable}
            />
          )}
        </div>
        <FailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={messageFail} />
      </div>
    </div>
  );
};

export default ChooseProvider;
