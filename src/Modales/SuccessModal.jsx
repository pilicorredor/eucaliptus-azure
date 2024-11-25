import React from "react";
import "./SuccessModal.css";
import Box from "@mui/material/Box";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";


const SuccessModal = ({ isOpen, onClose, message}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {" "}
      {/* Overlay oscuro */}
      <Box className="modal-box" onClick={(e) => e.stopPropagation()}>
        {" "}
        {/* Evita cerrar al hacer clic dentro del modal */}
        <h2>{message}</h2>
        <CheckCircleOutlineIcon className="modal-icon icon-green" />
        <button className="modal-button check-button" onClick={onClose}>
          Aceptar
        </button>
      </Box>
    </div>
  );
};

export default SuccessModal;
