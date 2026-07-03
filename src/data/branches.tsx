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
  },
  {
    name: "Цирюльня",
    color: "#0b817d",
    logo: tsirulnya,
    url: "/barbershop",
    element: <Barbershop />,
    images: [],
  },
];
