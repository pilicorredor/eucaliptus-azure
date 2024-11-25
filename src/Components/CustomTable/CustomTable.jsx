import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomModal from "../../Modales/CustomModal";
import CustomModalBill from "../../Modales/CustomModalBill";
import {
  BUTTONS_ACTIONS,
  REPORT_TRANSACTION,
  ROLES,
} from "../../Constants/Constants";

const CustomTable = ({
  data,
  customColumns,
  role,
  handleUpdateData,
  fetchProductsData,
  context,
  personRole,
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [entity, setEntity] = useState("proveedor");
  const [action, setAction] = useState("registrar");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);

  const handleModalOpen = ({ selectedEntity, selectedAction, id }) => {
    setEntity(selectedEntity);
    setAction(selectedAction);
    setSelectedId(id);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    handleUpdateData(role);
    if (entity === "producto") {
      fetchProductsData();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (id) => {
    navigate(`/modificar/${role}/${id}`);
  };

  const handleSelect = (id) => {
    if (context === REPORT_TRANSACTION.SALE) {
      setSelectedBillId(id);
      setIsBillModalOpen(true);
    } else if (context === REPORT_TRANSACTION.PURCHASE) {
      setSelectedBillId(id);
      setIsBillModalOpen(true);
    } else if (context === "registerProd") {
      navigate(`/productos/registrar/${id}`);
    } else if (context === "registerPurchase") {
      navigate(`/compra/productos/${id}`);
    } else if (context === "registerPurchaseAddProd") {
      navigate(`/compra/info-prod/${id}`);
    }
  };

  const handleModalBillClose = () => {
    setIsBillModalOpen(false);
  };

  const columnNamesLabels = {
    id_modify: "ID",
    name: "Nombre",
    addressCompany: "Dirección Empresa",
    address: "Dirección de domicilio",
    email: "Correo Electrónico",
    phoneNumber: "Teléfono",
    companyName: "Empresa",
    bankAccount: "Cuenta Bancaria",
    productName: "Nombre",
    brand: "Marca",
    categoryProduct: "Categoría",
    useProduct: "Uso",
    providerName: "Proveedor",
    idProduct: "ID del producto",
    unitName: "Unidad",
    unitDescription: "Descripción Unidad",
    quantity: "Cantidad",
    priceUnit: "Precio Unitario",
    subTotal: "SubTotal",
    totalPrice: "SubTotal",
    category: "Categoría",
    use: "Uso",
    idSale: "ID Factura",
    idSeller: "ID Vendedor",
    nameClient: "Cliente",
    total: "Total",
    purchaseId: "ID Factura",
    providerId: "ID Proveedor",
    totalPurchase: "Total Compra",
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", margin: "auto" }}>
      <div style={{ display: "flex", flexDirection: "column", height: "80%" }}>
        <TableContainer sx={{ maxHeight: 250 }}>
          <Table
            stickyHeader
            aria-label="sticky table"
            sx={{
              tableLayout: "fixed",
              width: "100%",
              minWidth: 400,
            }}
          >
            <TableHead>
              <TableRow>
                {customColumns.map((column) => (
                  <TableCell
                    key={column}
                    sx={{
                      backgroundColor: "#F8DEC4",
                      color: "#000000",
                      textAlign: "center",
                      borderRight: "1px solid #ddd",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {columnNamesLabels[column]}
                  </TableCell>
                ))}
                {context !== "report" && personRole !== ROLES.SELLER && (
                  <TableCell
                    sx={{
                      backgroundColor: "#F8DEC4",
                      color: "#000000",
                      textAlign: "center",
                      borderRight: "1px solid #ddd",
                    }}
                  >
                    Operación
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover tabIndex={-1} key={row.id}>
                    {customColumns.map((item) => (
                      <TableCell
                        key={item}
                        sx={{
                          textAlign: "center",
                          borderRight: "1px solid #ddd",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row[item]}
                      </TableCell>
                    ))}
                    {context !== "report" && personRole !== ROLES.SELLER && (
                      <TableCell
                        sx={{
                          textAlign: "center",
                          borderRight: "1px solid #ddd",
                          padding: "10px",
                        }}
                      >
                        {(() => {
                          if (
                            context === REPORT_TRANSACTION.SALE ||
                            context === REPORT_TRANSACTION.PURCHASE
                          ) {
                            return (
                              <button
                                onClick={() => handleSelect(row.id_modify)}
                                style={{
                                  backgroundColor: "#227e3c",
                                  color: "white",
                                  padding: "8px 16px",
                                  borderRadius: "8px",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: "16px",
                                }}
                              >
                                Ver Factura
                              </button>
                            );
                          }

                          if (
                            [
                              "registerProd",
                              "registerPurchase",
                              "registerPurchaseAddProd",
                            ].includes(context)
                          ) {
                            return (
                              <button
                                onClick={() => handleSelect(row.id_modify)}
                                style={{
                                  backgroundColor: "#227e3c",
                                  color: "white",
                                  padding: "8px 16px",
                                  borderRadius: "8px",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: "16px",
                                }}
                              >
                                Seleccionar
                              </button>
                            );
                          }

                          return (
                            <>
                              <IconButton
                                aria-label="edit"
                                onClick={() => handleEdit(row.id_modify)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                aria-label="delete"
                                onClick={() =>
                                  handleModalOpen({
                                    selectedEntity: role,
                                    selectedAction: BUTTONS_ACTIONS.ELIMINAR,
                                    id: row.id_modify,
                                  })
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </>
                          );
                        })()}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 25, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <CustomModal
          entity={entity}
          action={action}
          openModal={openModal}
          onClose={handleModalClose}
          id={selectedId}
        />
        <CustomModalBill
          isOpen={isBillModalOpen}
          billId={selectedBillId}
          onClose={handleModalBillClose}
          typeBill={context}
        />
      </div>
    </Paper>
  );
};

export default CustomTable;
