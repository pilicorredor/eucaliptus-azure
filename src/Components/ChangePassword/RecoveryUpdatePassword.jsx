import React, { useState } from "react";
import './RecoveryUpdatePassword.css';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useEmail } from "../../Context/EmailContext";
import { useVerifCode } from "../../Context/VerificationCodeContext";
import { SERVICES } from "../../Constants/Constants";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../../Modales/SuccessModal.jsx";
import FailModal from "../../Modales/FailModal.jsx"


const RecoveryUpdatePassword = () => {

    const [loading, setLoading] = useState(false);
    const [newPassword, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageSuccess, setMessageSuccess] = useState("");
    const [messageFail, setMessageFail] = useState("");
    const [isSuccesful, setIsSuccesful] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const { email } = useEmail();
    const { code } = useVerifCode();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

    const handleSubmit = async () => {
        if (newPassword !== confirmPassword) {
            setErrorMessage("Las contraseñas no coinciden. Por favor, verifícalas.");
        } else {
            setErrorMessage("");
            setLoading(true);
            try {
                console.log(code);
                const response = await fetch(SERVICES.RECOVERY_PASSWORD, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        newPassword,
                        code,
                    }),
                });

                if (response.ok) {
                    setLoading(false);
                    setIsSuccesful(true)
                    setMessageSuccess("Contraseña actualizada correctamente")
                    setIsModalOpen(true)
                    navigate("/");

                } else {
                    setLoading(false);
                    setMessageFail("No fue posible actualizar la contraseña")
                    setIsModalOpen(true)
                }

            } catch (error) {
                setLoading(false);
                setMessageFail("No fue posible actualizar la contraseña")
                setIsModalOpen(true)
            }
        }
    };

    return (
        <div className="updatePassword-section">
            <div className="updatePassword-content">
                <h1>Actualiza tu contraseña</h1>
                <p>Digita una nueva contraseña en el campo a continuación para cambiar tu contraseña</p>
                <div className="input-update-box">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="input-update"
                        placeholder="Nueva contraseña"
                        onChange={handlePasswordChange}
                    />
                    {showPassword ? (
                        <FaEye className="update-icon" onClick={togglePasswordVisibility} />
                    ) : (
                        <FaEyeSlash className="update-icon" onClick={togglePasswordVisibility} />
                    )}

                </div>
                <div className="input-update-box">
                    <input
                        type="password"
                        name="input-update"
                        placeholder="Confirmar contraseña"
                        onChange={handleConfirmPasswordChange}
                    />
                </div>

                {errorMessage &&
                    <p className="error-message"
                        style={{ color: "red", fontSize: "16px", marginTop: "5px" }}>

                        {errorMessage}

                    </p>}
                {loading && (
                    <div className="loading-container">
                        <CircularProgress className="loading-icon" />
                    </div>
                )}
                <div className="send-update-btn">
                    <button onClick={handleSubmit}>Actualizar</button>
                </div>
            </div>
            {
                isSuccesful ?
                    <SuccessModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        message={messageSuccess} />
                    : <FailModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        message={messageFail} />
            }
        </div>
    );
}

export default RecoveryUpdatePassword;