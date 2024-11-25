import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import "./SummaryTable.css";

const SummaryTable = ({ summaryData, onRemove }) => {
  return (
    <div className="summary-table">
      <h3>Resumen de venta</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th className="left-align">Nombre del producto</th>
              <th className="center-align">Cantidad</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((item) => (
              <tr key={item.id_modify}>
                <td className="left-align">{item.productName}</td>
                <td className="center-align">{item.quantitySold}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => onRemove(item.id_modify)}
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryTable;
