import { useNavigate } from "react-router-dom";
import styles from "./BackButton.module.css";

interface BackButtonProps {
  to?: string;
}

const BackButton = ({ to }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button onClick={handleClick} className={styles.backButton}>
      <span className={styles.arrow}>←</span>
      Назад
    </button>
  );
};

export default BackButton;
