import React from "react";
import "./ErrorSpecificModal.css";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Box from "@mui/material/Box";
import { ERRORS } from "../Constants/Constants";

const ErrorSpecificModal = ({
  isOpen,
  onClose,
  error,
  message,
  onOverwrite,
  onRecover,
}) => {
  if (!isOpen) return null;

  return (
    <Box className="modal-box">
      <h2>{message}</h2>
      <HighlightOffIcon className="modal-icon icon-red" />
      <div>
        {error === ERRORS.ERROR_302 ? (
          <>
            <div className="modal-buttons-box">
              <button className="modal-button check-button" onClick={onRecover}>
                Nuevo Representante
              </button>
              <button
                className="modal-button check-button"
                onClick={onOverwrite}
              >
                Sobrescribir
              </button>
            </div>
          </>
        ) : (
          <button className="modal-button check-button" onClick={onClose}>
            Aceptar
          </button>
        )}
      </div>
    </Box>
  );
};

export default ErrorSpecificModal;
