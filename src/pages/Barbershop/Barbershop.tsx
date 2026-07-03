import { barbershopLinks } from "../../data/links";
import Header from "../../components/Header/Header";
import styles from "./styles.module.css";
const Barbershop = () => {
  return (
    <div className={styles.container}>
      <Header links={barbershopLinks} />
    </div>
  );
};
export default Barbershop;
