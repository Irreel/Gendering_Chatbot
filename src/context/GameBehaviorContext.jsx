import React, { createContext, useState } from 'react';
import { idx2Name } from '../utils/itemDescription';

// Create the UserContext
export const GameBehaviorContext = createContext();

// Create the UserProvider component
export const GameBehaviorProvider = ({ children }) => {

  // State to store user behavior data
  const [confirmAllow, setConfirmAllow] = useState(true); // Whether user can confirm the selection
  const [currentSelection, setCurrentSelection] = useState('Unselected');
  const [currentStage, setCurrentStage] = useState({0:['Canvas','Tarp']});

  // Function to switch ConfirmAllow
  const switchConfirmAllow = (bool) => {
    setConfirmAllow(bool);
  };

  const nextStage = () => {
    let idx = Object.keys(currentStage)[0];
    if (idx == 4){
      return false;
    }
    else {
      let next_idx = idx + 1;
      setCurrentStage({next_idx:[idx2Name(2*next_idx), idx2Name(2*next_idx+1)]});
      return true;
    }
  }

  // Value object to be passed to consumers
  const value = {
    confirmAllow,
    switchConfirmAllow,
    currentStage,
    nextStage,
    setCurrentStage,
    currentSelection, 
    setCurrentSelection
  };


  // Render the UserProvider with the value object
  return <GameBehaviorContext.Provider value={value}>{children}</GameBehaviorContext.Provider>;
};
