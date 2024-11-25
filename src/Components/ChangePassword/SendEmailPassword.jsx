import React, { useState } from "react";
import "./SendEmailPassword.css";
import { IoMdMail } from "react-icons/io";
import { SERVICES } from "../../Constants/Constants";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useEmail } from "../../Context/EmailContext";
import FailModal from "../../Modales/FailModal.jsx";

const SendEmailPassword = () => {
  const { email, setEmail } = useEmail();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageFail, setMessageFail] = useState("");

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const url = `${SERVICES.RECOVERY_EMAIL_REQUEST}/${email}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (response.ok) {
        setLoading(false);
        navigate("/config/check-token-password");
      } else {
        setLoading(false);
        setMessageFail(
          "El correo ingresado no coincide con el registrado, porfavor verifica tu correo e intentalo de nuevo"
        );
        setIsModalOpen(true);
      }
    } catch (error) {
      setLoading(false);
      setMessageFail(
        "Ocurrión un error interno del servidor al intentar enviar el correo"
      );
      setIsModalOpen(true);
    }
  };

  return (
    <div className="emailPassword-section">
      <div className="emailPassword-content">
        <h1>Actualiza tu contraseña</h1>
        <p>
          Enviaremos un número de seis dígitos a tu correo para que puedas
          actualizar tu contraseña
        </p>
        <div className="input-email-box">
          <input
            type="text"
            name="input-email"
            placeholder="laura@example.com"
            onChange={handleInputChange(setEmail)}
          />
          <IoMdMail className="email-icon" />
        </div>
        <div className="send-email-btn">
          {loading && (
            <div className="loading-container">
              <CircularProgress className="loading-icon" />
            </div>
          )}
          <button onClick={handleSubmit}>Enviar Correo</button>
        </div>
      </div>
      <FailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={messageFail}
      />
    </div>
  );
};

export default SendEmailPassword;
