import React from "react";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io";
import * as Io5Icons from "react-icons/io5";
import * as FaIcons6 from "react-icons/fa6";

export const SidebarData = [
  {
    title: "Inicio",
    path: "/inicio",
    icon: <IoIcons.IoMdHome className="nav-menu-item-icon" />,
    cName: "nav-text",
  },
  {
    title: "Personal",
    path: "/personal/proveedor",
    icon: <IoIcons.IoMdPeople className="nav-menu-item-icon" />,
    cName: "nav-text",
  },
  {
    title: "Productos",
    path: "/productos",
    icon: <IoIcons.IoMdPricetags className="nav-menu-item-icon" />,
    cName: "nav-text",
  },
  {
    title: "Registrar compra",
    path: "/compra/proveedor",
    icon: <Io5Icons.IoBagAdd className="nav-menu-item-icon" />,
    cName: "nav-text",
  },
  {
    title: "Registrar venta",
    path: "/nueva-venta",
    icon: <Io5Icons.IoBagRemove className="nav-menu-item-icon" />,
    cName: "nav-text",
  },
  {
    title: "Productos vendidos",
    path: "/productos-vendidos",
    icon: <FaIcons.FaInbox className="nav-menu-item-icon" />,
    cName: "nav-text",
  },
  {
    title: "Reporte de movimientos",
    path: "/reportes",
    icon: <FaIcons6.FaFileLines className="nav-menu-item-icon" />,
    cName: "nav-text",
  },
];
