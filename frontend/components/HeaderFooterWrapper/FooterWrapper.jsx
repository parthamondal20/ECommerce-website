import useHome from "../../context/HomeContext/HomeContext";
import Footer from "../Footer/Footer";

export default function FooterWrapper() {
  const { home } = useHome();
  return <>{home && <Footer />}</>;
}
