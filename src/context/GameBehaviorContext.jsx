import React, { createContext, useState } from 'react';

// Create the UserContext
export const GameBehaviorContext = createContext();

// Create the UserProvider component
export const GameBehaviorProvider = ({ children }) => {

  // State to store user behavior data
  const [confirmAllow, setConfirmAllow] = useState(true); // Whether user can confirm the selection
  // const [sendAllow, setSendAllow] = useState(true); // User cannot send message until convo is triggered

  // Function to switch ConfirmAllow
  const switchConfirmAllow = (bool) => {
    setConfirmAllow(bool);
    // if(confirmAllow) {
    //   setConfirmAllow(false);
    // }
    // else {
    //   setConfirmAllow(true);
    // }
  };

  // Value object to be passed to consumers
  const value = {
    confirmAllow,
    switchConfirmAllow,
  };


  // Render the UserProvider with the value object
  return <GameBehaviorContext.Provider value={value}>{children}</GameBehaviorContext.Provider>;
};
