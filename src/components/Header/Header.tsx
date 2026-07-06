import { useState } from "react";
import type { BranchLinks, User } from "../../interface/interface";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import ModalContacts from "../Modal/ModalContacts";

interface ContactInfo {
  name: string;
  color: string;
  phone: string;
  address: string;
  link?: string;
  workSchedule: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

interface Props {
  links: BranchLinks[];
  dark?: boolean;
  contactInfo?: ContactInfo;
  onServicesClick?: () => void;
  user?: User | null;
  onLogout?: () => void;
}

const Header = ({ links, dark, contactInfo, onServicesClick, user, onLogout }: Props) => {
  const [contactsOpen, setContactsOpen] = useState(false);
  const visibleLinks = links.filter(
    (item) => item.name !== "Авторизация" && item.name !== "Регистрация"
  );

  return (
    <div className={`${styles.container} ${dark ? styles.dark : ""}`}>
      <div className={styles.inner}>
        {visibleLinks.map((item, index) => {
          if (item.name === "Контакты") {
            return (
              <button
                key={index}
                className={styles.linkButton}
                onClick={() => setContactsOpen(true)}
              >
                {item.name}
              </button>
            );
          }
          if (item.name === "Услуги" && onServicesClick) {
            return (
              <button
                key={index}
                className={styles.linkButton}
                onClick={onServicesClick}
              >
                {item.name}
              </button>
            );
          }
          return (
            <Link key={index} to={item.url}>
              {item.name}
            </Link>
          );
        })}
        <div className={styles.authSection}>
          {user ? (
            <>
              <span className={styles.userName}>{user.fullName || user.username}</span>
              <button className={styles.linkButton} onClick={onLogout}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/auth">Войти</Link>
              <Link to="/registration">Регистрация</Link>
            </>
          )}
        </div>
      </div>
      {contactInfo && (
        <ModalContacts
          isOpen={contactsOpen}
          onClose={() => setContactsOpen(false)}
          name={contactInfo.name}
          color={contactInfo.color}
          phone={contactInfo.phone}
          address={contactInfo.address}
          link={contactInfo.link}
          workSchedule={contactInfo.workSchedule}
        />
      )}
    </div>
  );
};

export default Header;
