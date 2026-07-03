import BranchBlock from "../../components/BranchBlock/BranchBlock";
import { branches } from "../../data/branches";
import styles from "./styles.module.css";

const BranchesPage = () => {
  return (
    <div className={styles.hero}>
      <h1 className={styles.title}>Салон красоты</h1>
      <p className={styles.subtitle}>
        Выберите филиал, чтобы записаться на услугу
      </p>
      <div className={styles.grid}>
        {branches.map((item, index) => (
          <BranchBlock
            key={index}
            url={item.url}
            name={item.name}
            logo={item.logo}
            color={item.color}
          />
        ))}
      </div>
    </div>
  );
};

export default BranchesPage;
