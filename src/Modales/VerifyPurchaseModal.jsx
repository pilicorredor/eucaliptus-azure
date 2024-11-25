import React from "react";
import "./VerifyPurchaseModal.css";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Box from "@mui/material/Box";

const VerifyPurchaseModal = ({ isOpen, onClose, message, onNavigate }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {" "}
      {/* Overlay oscuro */}
      <Box className="modal-box" onClick={(e) => e.stopPropagation()}>
        {" "}
        {/* Evita cerrar al hacer clic dentro del modal */}
        <h2>{message}</h2>
        <ErrorOutlineIcon className="modal-icon" />
        <button className="modal-button check-button" onClick={onNavigate}>
          Aceptar
        </button>
      </Box>
    </div>
  );
};

export default VerifyPurchaseModal;
