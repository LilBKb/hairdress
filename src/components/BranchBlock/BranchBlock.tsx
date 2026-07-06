import styles from "./styles.module.css";
import { useNavigate } from "react-router";

const BranchBlock = ({ logo, name, url, color }: { logo: string; name: string; url: string; color: string }) => {
  const navigate = useNavigate();

  return (
    <div
      className={styles.card}
      style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
      onClick={() => navigate(url)}
    >
      <img src={logo} alt={name} className={styles.logo} />
      <p className={styles.name}>{name}</p>
      <div className={styles.actions}>
        <button className={styles.button} onClick={(e) => { e.stopPropagation(); navigate(url); }}>
          Перейти
        </button>
      </div>
    </div>
  );
};
export default BranchBlock;
