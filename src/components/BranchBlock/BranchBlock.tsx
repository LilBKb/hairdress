import styles from "./styles.module.css";
import { useNavigate } from "react-router";
interface Props {
  logo: string;
  name: string;
  url: string;
  color: any;
}

const BranchBlock = ({ logo, name, url, color }: Props) => {
  const navigate = useNavigate();
  return (
    <div className={styles.card} style={{ backgroundColor: color }}>
      <img src={logo} />
      <p>{name}</p>
      <button onClick={() => navigate(url)}>{name}</button>
    </div>
  );
};
export default BranchBlock;
