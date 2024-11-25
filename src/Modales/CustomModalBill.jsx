import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import "./CustomModalBill.css";
import { SERVICES, REPORT_TRANSACTION } from "../Constants/Constants";
import CustomTableBillModal from "../Components/CustomTableBill/CustomTableBillModal";

const CustomModalBill = ({ isOpen, billId, typeBill, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [isSale, setIsSale] = useState(false);
  const [purchaseID, setPurchaseID] = useState();
  const [pruchaseDate, setPruchaseDate] = useState();
  const [purchaseDetails, setPurchaseDetails] = useState();
  const [providerData, setProviderData] = useState();
  const [dataSale, setDataSale] = useState();
  const [saleDetails, setSaleDetails] = useState();
  const [clientData, setClientData] = useState();

  const fetchSaleById = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const url = `${SERVICES.GET_SALE_DETAIL_SERVICE}/${id}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDataSale(data);
        setSaleDetails(data.saleDetails);
        setClientData(data.clientDTO);
        setLoading(false);
      } else {
        console.error("Error al traer la venta:", await response.json());
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const fetchPurchaseById = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const url = `${SERVICES.GET_PURCHASE_DETAIL_SERVICE}/${id}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPurchaseID(data.purchaseId);
        setPruchaseDate(data.purchaseDate);
        setPurchaseDetails(data.purchaseDetails);
        setProviderData(data.providerDTO);
        setLoading(false);
      } else {
        console.error("Error al traer la compra:", await response.json());
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (typeBill === REPORT_TRANSACTION.SALE) {
        setIsSale(true);
        await fetchSaleById(billId);
      } else if (typeBill === REPORT_TRANSACTION.PURCHASE) {
        setIsSale(false);
        await fetchPurchaseById(billId);
      }
    };

    if (isOpen && billId && typeBill) {
      fetchData();
    }
  }, [isOpen, billId, typeBill]);

  if (!isOpen) return null;

  return (
    <div id="modal-overlay" class="modal-overlay">
      <Box className="modal-box-bill">
        {loading && (
          <div className="modal-loading-container">
            <CircularProgress className="modal-loading-icon" />
          </div>
        )}
        <div className="table-bill">
          <CustomTableBillModal
            isSale={isSale}
            saleDetails={saleDetails}
            dataSale={dataSale}
            clientData={clientData}
            purchaseID={purchaseID}
            pruchaseDate={pruchaseDate}
            purchaseDetails={purchaseDetails}
            providerData={providerData}
          />
        </div>
        <div>
          <button className="modal-button check-button" onClick={onClose}>
            Aceptar
          </button>
        </div>
      </Box>
    </div>
  );
};

export default CustomModalBill;
