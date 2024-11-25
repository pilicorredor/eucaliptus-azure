import React, { useState } from "react";
import './CheckPswdToken.css';
import { useEmail } from "../../Context/EmailContext";
import { useVerifCode } from "../../Context/VerificationCodeContext";
import CircularProgress from "@mui/material/CircularProgress";
import { SERVICES } from "../../Constants/Constants";
import { useNavigate } from "react-router-dom";
import FailModal from "../../Modales/FailModal.jsx"


const CheckPswdToken = () => {
    const [loading, setLoading] = useState(false);
    const [messageFail, setMessageFail] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { email } = useEmail();
    const navigate = useNavigate();
    const { code, setVerifCode } = useVerifCode();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            console.log(code);
            const response = await fetch(SERVICES.RECOVERY_VALIDATE_CODE, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    code,
                }),
            });

            if (response.ok) {
                setLoading(false);
                navigate("/config/recovery-update-password");
            } else {
                setLoading(false);
                setMessageFail('Porfavor verifique que el token ingresado sea el correcto')
                setIsModalOpen(true)
            }

        } catch (error) {
            setLoading(false);
            setMessageFail('Ocurrió un error interno del servidor')
            setIsModalOpen(true)
        }

    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value.length <= 6) {
            setVerifCode(value);
        }
    };

    return (
        <div className="tokenPassword-section">
            <div className="tokenPassword-content">
                <h1>Confirmar código</h1>
                <p>Ingresa a continuación el número que recibiste en tu correo</p>
                <div className="input-token-box">
                    <input
                        type="number"
                        name="input-token"
                        placeholder="123456"
                        onChange={handleInputChange}
                        onInput={(e) => {
                            if (e.target.value.length > 6) {
                                e.target.value = e.target.value.slice(0, 6); // Limita a 6 dígitos
                            }
                        }}
                    />
                </div>
                {loading && (
                    <div className="loading-container">
                        <CircularProgress className="loading-icon" />
                    </div>
                )}
                <div className="send-token-btn">
                    <button onClick={handleSubmit}>Verificar</button>
                </div>
            </div>
            <FailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                message={messageFail} />
        </div>
    );
}

export default CheckPswdToken;