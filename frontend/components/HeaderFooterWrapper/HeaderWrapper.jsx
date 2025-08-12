import useHome from "../../context/HomeContext/HomeContext";
import Header from "../Header/Header";
export default function HeaderWrapper() {
  const { home } = useHome();
  return <>{home && <Header />}</>;
}
