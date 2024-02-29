import React, { createContext, useState } from 'react';

// Create the UserContext
export const GameBehaviorContext = createContext();

// Create the UserProvider component
export const GameBehaviorProvider = ({ children }) => {

  // State to store user behavior data
  const [confirmAllow, setConfirmAllow] = useState(true); // Whether user can confirm the selection
  const [itemStage, setItemStage] = useState(0); 
  const [currentSelection, setCurrentSelection] = useState('Unselected');

  // Function to switch ConfirmAllow
  const switchConfirmAllow = (bool) => {
    setConfirmAllow(bool);
  };

  const nextStage= () => {
    if (itemStage == 4){
      return false;
    }
    else {
      setItemStage(itemStage+1);
      return true;
    }
  }

  // Value object to be passed to consumers
  const value = {
    confirmAllow,
    switchConfirmAllow,
    itemStage,
    nextStage,
    currentSelection, 
    setCurrentSelection
  };


  // Render the UserProvider with the value object
  return <GameBehaviorContext.Provider value={value}>{children}</GameBehaviorContext.Provider>;
};
