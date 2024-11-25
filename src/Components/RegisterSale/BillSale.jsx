import React from "react";
import { useNavigate } from "react-router-dom";
import CustomTableBill from "../CustomTableBill/CustomTableBill";
import Header from "../Header/Header.jsx";
import "./BillSale.css";

const BillSale = () => {
  const navigate = useNavigate();

  const handleClearProducts = () => {
    navigate("/nueva-venta");
  };

  const handlePrint = () => {
    //Agregarle algo para simular la impresión o algo así
  };

  return (
    <div className="sale">
      <Header pageTitle="Comprobante de Venta" />
      <div className="table-bill">
        <CustomTableBill isSale={true} />
      </div>
      <div className="billSale-buttons-box">
        <button
          className="billSale-button check-button"
          onClick={handleClearProducts}
        >
          Aceptar
        </button>
        <button className="billSale-button check-button" onClick={handlePrint}>
          Enviar Factura
        </button>
      </div>
    </div>
  );
};

export default BillSale;
