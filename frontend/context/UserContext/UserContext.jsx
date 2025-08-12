import { createContext, useContext, useState, useEffect } from "react";
export const UserContext = createContext(null);
export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const storeUser = localStorage.getItem("user");
    if (storeUser) {
      setUser(JSON.parse(storeUser));
    }
    setLoading(false);
  }, []);
  if (loading) return null;
  const UserProvider = UserContext.Provider;
  return <UserProvider value={{ user, setUser }}>{children}</UserProvider>;
}
export default function useUser() {
  return useContext(UserContext);
}
