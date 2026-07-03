import type { Branch } from "../interface/interface";
import fox from "../assets/fox.jpg";
import tsirulnya from "../assets/tsirulnya.jpg";
import RedFox from "../pages/RedFox/RedFox";
import Barbershop from "../pages/Barbershop/Barbershop";
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
  },
  {
    name: "Цирюльня",
    color: "#0b817d",
    logo: tsirulnya,
    url: "/barbershop",
    element: <Barbershop />,
  },
];
