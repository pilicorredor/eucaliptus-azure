import React, { createContext, useState } from "react";

export const ButtonContext = createContext();

export const ButtonProvider = ({ children }) => {
  const [isButtonActive, setIsButtonActive] = useState(false);

  return (
    <ButtonContext.Provider value={{ isButtonActive, setIsButtonActive }}>
      {children}
    </ButtonContext.Provider>
  );
};
