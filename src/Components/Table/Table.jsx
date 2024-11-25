import React from 'react';
import './Table.css';

const Table = ({ columns, data, onEdit, onDelete }) => {
    return (
        <div className="table-container">
            <table className="custom-table">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column}</th>
                        ))}
                        <th>Operación</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex}>{item[column]}</td>
                            ))}
                            <td>
                                <button onClick={() => onEdit(item.id)} className="btn-edit">Editar</button>
                                <button onClick={() => onDelete(item.id)} className="btn-delete">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
