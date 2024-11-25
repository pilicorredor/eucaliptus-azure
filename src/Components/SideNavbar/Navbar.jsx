import { useEffect, useState } from "react";
import * as Io5Icons from "react-icons/io5";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import "./Navbar.css";
import userImg from "../../Assets/person-circle.png";
import { ROLES } from "../../Constants/Constants";

const Navbar = ({ username, role, handleLogout }) => {
  const [roleName, setRoleName] = useState("Rol no asignado");

  useEffect(() => {
    if (role === ROLES.ADMIN) {
      setRoleName("Administrador");
    } else {
      setRoleName("Vendedor");
    }
  }, [role]);

  const sellFields = ["Inicio", "Productos", "Registrar venta"];

  return (
    <div className="sidebar">
      <img src={userImg} alt="Profile" className="profile-image" />
      <div className="user-profile">
        <h4 className="username">{username || "Usuario"}</h4>
        <div className="user-role">{roleName}</div>
      </div>
      <hr className="divider" />
      <ul className="nav-menu-items">
        {SidebarData.filter((item) => {
          return role === ROLES.ADMIN || sellFields.includes(item.title);
        }).map((item, index) => (
          <li key={index}>
            <Link to={item.path} className="item">
              {item.icon}
              <span className="menu-text">{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="nav-item-bottom">
        <Link to="/" onClick={handleLogout}>
          <Io5Icons.IoExit className="nav-menu-item-icon" />
          <span className="menu-text">Salir</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
