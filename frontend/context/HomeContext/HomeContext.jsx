import { createContext, useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
const HomeContext = createContext(null);
export function HomeContextProvider({ children }) {
  const [home, setHome] = useState(true);
  const localtion = useLocation();
  useEffect(() => {
    const hideLayout = [
      "/login",
      "/register",
      "/checkout",
      "/OrderSuccess",
      "/forget-password",
      "/Verify-OTP",
      "/reset-password",
    ];
    const shouldShowLayout = !hideLayout.includes(location.pathname);
    setHome(shouldShowLayout);
  }, [localtion.pathname]);
  return (
    <HomeContext.Provider value={{ home, setHome }}>
      {children}
    </HomeContext.Provider>
  );
}
export default function useHome() {
  return useContext(HomeContext);
}
