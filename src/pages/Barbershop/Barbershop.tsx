import { barbershopLinks } from "../../data/links";
import Header from "../../components/Header/Header";
import BackButton from "../../components/BackButton/BackButton";
import styles from "./styles.module.css";

const Barbershop = () => {
  return (
    <div className={styles.page}>
      <Header links={barbershopLinks} dark />
      <BackButton to="/" />
      <div className={styles.hero}>
        <h1 className={styles.title}>Цирюльня</h1>
        <p className={styles.subtitle}>Мужская парикмахерская</p>
      </div>
      <div className={styles.content}>
      </div>
    </div>
  );
};
export default Barbershop;
