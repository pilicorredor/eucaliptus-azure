import React, { useState, useEffect } from "react";
import "./UnitModal.css";

const UnitModal = ({ isOpen, onClose, onSave, mode, unitName }) => {
  const [unitData, setUnitData] = useState({
    unitName: "",
    description: "",
  });

  const [isDataCompleted, setIsDataCompleted] = useState(false);

  useEffect(() => {
    if (unitName) {
      setUnitData({ unitName: unitName, description: "" });
    }
  }, [unitName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIsDataCompleted(false);
    setUnitData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Previene el comportamiento predeterminado del formulario
    if (unitData.unitName.trim() && unitData.description.trim()) {
      onSave(unitData);
      setUnitData({ unitName: "", description: "" });
    } else {
      setIsDataCompleted(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>
          {mode === "addUnit" ? "Agregar Nueva Unidad" : "Agregar Descripción"}
        </h3>
        <form onSubmit={handleSubmit}>
          {mode === "addUnit" && (
            <div className="modal-field">
              <label>Nombre de la Unidad:</label>
              <input
                type="text"
                name="unitName"
                value={unitData.unitName}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {mode === "addDescription" && (
            <div className="modal-field">
              <label>Nombre de la Unidad:</label>
              <input
                type="text"
                name="unitName"
                value={unitData.unitName}
                disabled
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="modal-field">
            <label>Descripción de la Unidad:</label>
            <input
              type="text"
              name="description"
              value={unitData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          {isDataCompleted && (
            <div className="unitmodal-incomplete-message">
              Completa todos los campos
            </div>
          )}

          <div className="unitModal-buttons-box">
            <button
              type="button"
              className="modal-button cancel-button"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="modal-button check-button"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnitModal;
