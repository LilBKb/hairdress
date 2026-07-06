import type { Branch } from "../interface/interface";
import fox from "../assets/fox.jpg";
import tsirulnya from "../assets/tsirulnya.jpg";
import RedFox from "../pages/RedFox/RedFox";
import Barbershop from "../pages/Barbershop/Barbershop";
import img1 from "../assets/RedFox/1.jpg";
import img2 from "../assets/RedFox/2.jpg";
import img3 from "../assets/RedFox/3.jpg";
import img4 from "../assets/RedFox/4.jpg";
import img5 from "../assets/RedFox/5.jpg";
import img6 from "../assets/RedFox/6.jpg";
import img7 from "../assets/RedFox/7.jpg";
import img8 from "../assets/RedFox/8.jpg";
import img9 from "../assets/RedFox/9.jpg";
import img10 from "../assets/RedFox/10.jpg";
import img11 from "../assets/RedFox/11.jpg";
import img12 from "../assets/RedFox/12.jpg";
export const logoComponents = {
  fox,
  tsirulnya,
};
export const branches: Branch[] = [
  {
    name: "Рыжая лисица",
    color: "#f07c09",
    logo: fox,
    url: "/redFox",
    element: <RedFox />,
    images: [
      { src: img1, alt: "Рыжая лисица 1" },
      { src: img2, alt: "Рыжая лисица 2" },
      { src: img3, alt: "Рыжая лисица 3" },
      { src: img4, alt: "Рыжая лисица 4" },
      { src: img5, alt: "Рыжая лисица 5" },
      { src: img6, alt: "Рыжая лисица 6" },
      { src: img7, alt: "Рыжая лисица 7" },
      { src: img8, alt: "Рыжая лисица 8" },
      { src: img9, alt: "Рыжая лисица 9" },
      { src: img10, alt: "Рыжая лисица 10" },
      { src: img11, alt: "Рыжая лисица 11" },
      { src: img12, alt: "Рыжая лисица 12" },
    ],
    contacts: {
      phone: "+7 (910) 886-57-79",
      address: "ул.Калинина,40, г.Арзамас",
    },
    workSchedule: {
      monday: "09:00-19:00",
      tuesday: "09:00-19:00",
      wednesday: "09:00-19:00",
      thursday: "09:00-19:00",
      friday: "09:00-19:00",
      saturday: "09:00-16:00",
      sunday: "09:00-16:00",
    },
    priceList: [
      {
        service: "Мужская стрижка",
        price: "550 ₽",
        type: "Мужская",
      },
      {
        service: "Стрижка под насадку",
        price: "350 ₽",
        type: "Мужская",
      },
      {
        service: "Оформление бороды",
        price: "300 ₽",
        type: "Мужская",
      },
      {
        service: "Детская модельная",
        price: "450 ₽",
        type: "Мужская",
      },
      {
        service: "Александровская скидка",
        price: "50 ₽",
        type: "Мужская",
      },
      {
        service: "Пилинг кожи головы",
        price: "500 ₽",
        type: "Мужская",
      },
      {
        service: "Мытье головы",
        price: "100 ₽",
        type: "Мужская",
      },
      {
        service: "Подравнивание усов, бровей",
        price: "200 ₽",
        type: "Мужская",
      },

      // Женские услуги
      {
        service: "Модельная стрижка",
        price: "650–850 ₽",
        type: "Женская",
      },
      {
        service: "Подравнивание волос",
        price: "500 ₽",
        type: "Женская",
      },
      {
        service: "Окрашивание ресниц",
        price: "250 ₽",
        type: "Женская",
      },
      {
        service: "Оформление, окрашивание бровей",
        price: "500 ₽",
        type: "Женская",
      },
      {
        service: "Детская модельная",
        price: "450 ₽",
        type: "Женская",
      },
      {
        service: "Детская, подравнивание",
        price: "400 ₽",
        type: "Женская",
      },
      {
        service: "Химическая завивка",
        price: "1700–2500 ₽",
        type: "Женская",
      },
      {
        service: "Состав",
        price: "500–700 ₽",
        type: "Женская",
      },
      {
        service: "Окрашивание волос в один тон, обновление цвета",
        price: "1000–2500 ₽",
        type: "Женская",
      },
      {
        service: "Стоимость краски",
        price: "1 гр. — 10 ₽",
        type: "Женская",
      },
      {
        service: "Мелирование + тонирование",
        price: "1500–3000 ₽",
        type: "Женская",
      },
      {
        service: "Колорирование",
        price: "2000–3500 ₽",
        type: "Женская",
      },
      {
        service: "Dipity blond с растяжкой цвета",
        price: "2000–3500 ₽",
        type: "Женская",
      },
      {
        service: "Стоимость 1 колпачка",
        price: "350 ₽",
        type: "Женская",
      },
      {
        service: "Полировка волос",
        price: "1000 ₽",
        type: "Женская",
      },
      {
        service: "Мытье головы + сушка",
        price: "700 ₽",
        type: "Женская",
      },
    ],
  },
  {
    name: "Цирюльня",
    color: "#0b817d",
    logo: tsirulnya,
    url: "/barbershop",
    element: <Barbershop />,
    images: [],
    contacts: {
      phone: "+7 (920) 002-32-39",
      address: "ул.Ленина, 18 ,г.Арзамас",
      link: "https://vk.com/club112651692",
    },
    workSchedule: {
      monday: "09:00-18:00",
      tuesday: "09:00-18:00",
      wednesday: "09:00-18:00",
      thursday: "09:00-18:00",
      friday: "09:00-18:00",
      saturday: "09:00-16:00",
      sunday: "09:00-16:00",
    },
    priceList: [
      {
        service: "Мужская стрижка",
        price: "550 ₽",
        type: "Мужская",
      },
      {
        service: "Стрижка под насадку",
        price: "350 ₽",
        type: "Мужская",
      },
      {
        service: "Оформление бороды",
        price: "300 ₽",
        type: "Мужская",
      },
      {
        service: "Детская модельная",
        price: "450 ₽",
        type: "Мужская",
      },
      {
        service: "Александровская скидка",
        price: "50 ₽",
        type: "Мужская",
      },
      {
        service: "Пилинг кожи головы",
        price: "500 ₽",
        type: "Мужская",
      },
      {
        service: "Мытье головы",
        price: "100 ₽",
        type: "Мужская",
      },
      {
        service: "Подравнивание усов, бровей",
        price: "200 ₽",
        type: "Мужская",
      },

      // Женские услуги
      {
        service: "Модельная стрижка",
        price: "650–850 ₽",
        type: "Женская",
      },
      {
        service: "Подравнивание волос",
        price: "500 ₽",
        type: "Женская",
      },
      {
        service: "Окрашивание ресниц",
        price: "250 ₽",
        type: "Женская",
      },
      {
        service: "Оформление, окрашивание бровей",
        price: "500 ₽",
        type: "Женская",
      },
      {
        service: "Детская модельная",
        price: "450 ₽",
        type: "Женская",
      },
      {
        service: "Детская, подравнивание",
        price: "400 ₽",
        type: "Женская",
      },
      {
        service: "Химическая завивка",
        price: "1700–2500 ₽",
        type: "Женская",
      },
      {
        service: "Состав",
        price: "500–700 ₽",
        type: "Женская",
      },
      {
        service: "Окрашивание волос в один тон, обновление цвета",
        price: "1000–2500 ₽",
        type: "Женская",
      },
      {
        service: "Стоимость краски",
        price: "1 гр. — 10 ₽",
        type: "Женская",
      },
      {
        service: "Мелирование + тонирование",
        price: "1500–3000 ₽",
        type: "Женская",
      },
      {
        service: "Колорирование",
        price: "2000–3500 ₽",
        type: "Женская",
      },
      {
        service: "Dipity blond с растяжкой цвета",
        price: "2000–3500 ₽",
        type: "Женская",
      },
      {
        service: "Стоимость 1 колпачка",
        price: "350 ₽",
        type: "Женская",
      },
      {
        service: "Полировка волос",
        price: "1000 ₽",
        type: "Женская",
      },
      {
        service: "Мытье головы + сушка",
        price: "700 ₽",
        type: "Женская",
      },
    ],
  },
];
