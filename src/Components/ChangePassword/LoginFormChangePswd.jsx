import React, { useState } from "react";
import "./LoginFormChangePswd.css";
import { FaEye, FaUser } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import logo from "../../Assets/logo2.png";
import { useNavigate } from "react-router-dom";
import { SERVICES } from "../../Constants/Constants";
import CircularProgress from "@mui/material/CircularProgress";

const LoginFormChangePswd = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(SERVICES.LOGIN_SERVICE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);
        setLoading(false);
        handleLogin({
          username: localStorage.getItem("username"),
          role: localStorage.getItem("role"),
        });
        navigate("/config/update-password");
        setError(false);
      } else {
        setLoading(false);
        setError(true);
      }
    } catch (error) {
      console.error("Error en la solicitud de login:", error);
      setLoading(false);
      setError(true);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError(false);
  };

  return (
    <div className="login-section">
      <div className="wrapper">
        {loading && (
          <div className="loading-container">
            <CircularProgress className="loading-icon" />
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <img src={logo} alt="Logo de la Empresa" className="logo" />
          <h1>Porfavor ingresa nuevamente para continuar</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Nombre de Usuario"
              value={username}
              onChange={handleInputChange(setUsername)}
              required
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={handleInputChange(setPassword)}
              required
            />
            {showPassword ? (
              <FaEye className="icon" onClick={togglePasswordVisibility} />
            ) : (
              <FaEyeSlash className="icon" onClick={togglePasswordVisibility} />
            )}
          </div>
          {error && (
            <div className="error-message">
              Nombre de usuario o contraseña incorrecta
            </div>
          )}
          <div className="button-container">
            <button type="submit">Entrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginFormChangePswd;
