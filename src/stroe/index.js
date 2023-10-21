import { createContext } from "react";

export const UserContext = createContext();

function AppContext({ children }) {
  return (
    <UserContext.Provider value={{ name: "hello" }}>
      {children}
    </UserContext.Provider>
  );
}

export default AppContext;
