import React, { createContext, useContext, useState } from 'react';

export const VerificationCodeContext = createContext();

export const VerifCodeProvider = ({ children }) => {
    const [code, setVerifCode] = useState("");

    return (
        <VerificationCodeContext.Provider value={{ code, setVerifCode }}>
            {children}
        </VerificationCodeContext.Provider>
    );
};

export const useVerifCode = () => useContext(VerificationCodeContext);