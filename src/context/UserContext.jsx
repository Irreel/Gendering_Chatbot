import React, { createContext, useState } from 'react';

// Create the UserContext
export const UserContext = createContext();

// Create the UserProvider component
export const UserProvider = ({ children }) => {
  // State to store user data
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userCompletedGame, setUserCompletedGame] = useState(false);
  const [userCompletedPostTest, setUserCompletedPostTest] = useState(false);

  // Function to update user data
  const updateUser = (name, email) => {
    if (name !== null && email !== null) {
      setUserName(name);
      setUserEmail(email);
      console.log("User updated");
    } 
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
