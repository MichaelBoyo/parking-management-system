import { createContext, useState } from "react";

export const UserContext = createContext();

function AppContext({ children }) {
  const [balance, setBalance] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);

  const data = {
    balance,
    setBalance,
    loggedIn,
    setLoggedIn,
  };

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
}

export default AppContext;
