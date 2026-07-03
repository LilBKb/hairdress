import Header from "../../components/Header/Header";
import { redFoxLinks } from "../../data/links";
import Carousel from "../../components/Carousel/Carousel";
import styles from "./styles.module.css";
import { branches } from "../../data/branches";

const RedFox = () => {
  const images = branches[0].images;
  return (
    <div className={styles.container}>
      <Header links={redFoxLinks} />
      <Carousel images={images} />
    </div>
  );
};
export default RedFox;
