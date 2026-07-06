import { useState } from "react";
import Header from "../../components/Header/Header";
import { redFoxLinks } from "../../data/links";
import Carousel from "../../components/Carousel/Carousel";
import BackButton from "../../components/BackButton/BackButton";
import ModalServices from "../../components/Modal/ModalServices";
import styles from "./styles.module.css";
import { branches } from "../../data/branches";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/userSlice";

const RedFox = () => {
  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  const branch = branches[0];
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  return (
    <div className={styles.page}>
      <Header
        links={redFoxLinks}
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
        <h1 className={styles.title}>Рыжая лисица</h1>
        <p className={styles.subtitle}>Салон красоты и уюта</p>
      </div>
      <div className={styles.content}>
        <Carousel images={branch.images} />
      </div>
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
export default RedFox;
