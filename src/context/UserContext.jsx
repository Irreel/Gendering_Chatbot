import React, { createContext, useState } from 'react';
import randomizeIdxArray from '../utils/which2Suggest';
import randomizeGender from '../utils/randomizeGender';

// Create the UserContext
export const UserContext = createContext();

// Create the UserProvider component
export const UserProvider = ({ children }) => {
  // State to store user data
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userCompletedGame, setUserCompletedGame] = useState(false);
  const [userCompletedPostTest, setUserCompletedPostTest] = useState(false);
  const [chatbotRole, setChatbotRole] = useState(null);
  // const [triggeredPairs, setTriggeredPairs] = useState(null);
  const [triggeredPairs, setTriggeredPairs] = useState([0, 1, 0, 0, 1]); // TODO: change to null

  // Function to update user data
  const updateUser = (name, email) => {
    if (name !== null && email !== null) {
      setUserName(name);
      setUserEmail(email);
      console.log("User update in Context");

    } 
  };

  const initGameSettings = () => {
    if (!userCompletedGame) {
      setChatbotRole(randomizeGender());
      setTriggeredPairs(randomizeIdxArray());
      console.log("triggeredPair: ", triggeredPairs);
    }
    else alert("You have already completed the game!");
  };

  const completeGame = () => {
    setUserCompletedGame(true);
  };

  const completePostTest = () => {
    setUserCompletedPostTest(true);
  }

  // Value object to be passed to consumers
  const value = {
    userName,
    userEmail,
    updateUser,
    chatbotRole,
    triggeredPairs,
    initGameSettings,
    userCompletedGame,
    completeGame,
    userCompletedPostTest,
    completePostTest,
  };

  // const value = {
  //   userName: "test",
  //   userEmail: "test@uw.edu",
  //   updateUser,
  //   userCompletedGame,
  //   completeGame,
  //   userCompletedPostTest,
  //   completePostTest,
  // };

  // Render the UserProvider with the value object
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
