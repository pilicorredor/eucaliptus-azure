// src/context/EmailContext.js
import React, { createContext, useContext, useState } from 'react';

// Creamos el contexto
export const EmailContext = createContext();

// Creamos el proveedor del contexto
export const EmailProvider = ({ children }) => {
    const [email, setEmail] = useState("");

    return (
        <EmailContext.Provider value={{ email, setEmail }}>
            {children}
        </EmailContext.Provider>
    );
};

// Hook para usar el contexto de email
export const useEmail = () => useContext(EmailContext);
