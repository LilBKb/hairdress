import Header from "../../components/Header/Header";
import { redFoxLinks } from "../../data/links";
import Carousel from "../../components/Carousel/Carousel";
import BackButton from "../../components/BackButton/BackButton";
import styles from "./styles.module.css";
import { branches } from "../../data/branches";

const RedFox = () => {
  const images = branches[0].images;
  return (
    <div className={styles.page}>
      <Header links={redFoxLinks} />
      <BackButton to="/" />
      <div className={styles.hero}>
        <h1 className={styles.title}>Рыжая лисица</h1>
        <p className={styles.subtitle}>Салон красоты и уюта</p>
      </div>
      <div className={styles.content}>
        <Carousel images={images} />
      </div>
    </div>
  );
};
export default RedFox;
