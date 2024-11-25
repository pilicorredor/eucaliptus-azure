import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import CustomTableBill from "../CustomTableBill/CustomTableBill";
import { ProductContext } from "../../Context/ProductContext";
import Header from "../Header/Header.jsx";
import "./BillPurchase.css";

const BillPurchase = () => {
  const { clearProducts } = useContext(ProductContext);
  const navigate = useNavigate();

  const handleClearProducts = () => {
    clearProducts();
    navigate("/compra/proveedor");
  };

  const handlePrint = () => {
    //Agregarle algo para simular la impresión o algo así
    clearProducts();
  };

  return (
    <div className="purchas">
      <Header pageTitle="Comprobante de Compra" />
      <div className="table-bill">
        <CustomTableBill isSale={false} />
      </div>
      <div className="billpurchase-buttons-box">
        <button
          className="billpurchase-button check-button"
          onClick={handleClearProducts}
        >
          Aceptar
        </button>
        <button
          className="billpurchase-button check-button"
          onClick={handlePrint}
        >
          Enviar Factura
        </button>
      </div>
    </div>
  );
};

export default BillPurchase;
