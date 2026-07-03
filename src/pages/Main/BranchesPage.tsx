import BranchBlock from "../../components/BranchBlock/BranchBlock";
import { branches } from "../../data/branches";
import styles from "./styles.module.css";

const BranchesPage = () => {
  return (
    <div className={styles.container}>
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
  );
};

export default BranchesPage;
