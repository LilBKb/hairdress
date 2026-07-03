import type { BranchLinks } from "../../interface/interface";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
interface Props {
  links: BranchLinks[];
  dark?: boolean;
}
const Header = ({ links, dark }: Props) => {
  return (
    <div className={`${styles.container} ${dark ? styles.dark : ""}`}>
      {links.map((item, index) => (
        <Link key={index} to={item.url}>
          {item.name}
        </Link>
      ))}
    </div>
  );
};
export default Header;
