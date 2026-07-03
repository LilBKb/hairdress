import type { BranchLinks } from "../../interface/interface";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
interface Props {
  links: BranchLinks[];
}
const Header = ({ links }: Props) => {
  return (
    <div className={styles.container}>
      {links.map((item, index) => (
        <Link key={index} to={item.url}>
          {item.name}
        </Link>
      ))}
    </div>
  );
};
export default Header;
