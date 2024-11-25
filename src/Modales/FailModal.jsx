import React from "react";
import "./FailModal.css";
import Box from "@mui/material/Box";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";


const FailModal = ({ isOpen, onClose, message}) => {
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
        <button className="modal-button check-button" onClick={onClose}>
          Aceptar
        </button>
      </Box>
    </div>
  );
};

export default FailModal;
