import { useState } from "react";
import { barbershopLinks } from "../../data/links";
import Header from "../../components/Header/Header";
import BackButton from "../../components/BackButton/BackButton";
import ModalServices from "../../components/Modal/ModalServices";
import styles from "./styles.module.css";
import { branches } from "../../data/branches";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/userSlice";

const Barbershop = () => {
  const branch = branches[1];
  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  return (
    <div className={styles.page}>
      <Header
        links={barbershopLinks}
        dark
        user={user}
        onLogout={() => dispatch(logout())}
        contactInfo={{
          name: branch.name,
          color: branch.color,
          phone: branch.contacts.phone,
          address: branch.contacts.address,
          link: branch.contacts.link,
          workSchedule: branch.workSchedule,
        }}
        onServicesClick={() => setServicesModalOpen(true)}
      />
      <BackButton to="/" />
      <div className={styles.hero}>
        <h1 className={styles.title}>Цирюльня</h1>
        <p className={styles.subtitle}>Мужская парикмахерская</p>
      </div>
      <div className={styles.content}></div>
      <ModalServices
        isOpen={servicesModalOpen}
        onClose={() => setServicesModalOpen(false)}
        name={branch.name}
        color={branch.color}
        priceList={branch.priceList}
      />
    </div>
  );
};
export default Barbershop;
