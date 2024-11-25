import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import CircularProgress from "@mui/material/CircularProgress";

registerLocale("es", es);

const CalendarModal = ({ isOpen, onClose, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    await onConfirm(formattedDate);

    setLoading(false);
    onClose(); 
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className="modal-box">
        {loading && (
          <div className="modal-loading-container">
            <CircularProgress className="modal-loading-icon" />
          </div>
        )}
        <h2 id="modal-title">Seleccionar Fecha de Compra</h2>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          locale="es"
          inline
        />
        <div className="modal-buttons-box">
          <button className="modal-button cancel-button" onClick={onClose}>
            Cancelar
          </button>
          <button className="modal-button check-button" onClick={handleConfirm}>
            Finalizar Compra
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default CalendarModal;
