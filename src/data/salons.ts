import type {
  Hairdresser,
  HairdresserWorkPattern,
  Service,
} from "../interface/interface"

export const SALON_IDS = {
  redFox: 1,
  barbershop: 2,
} as const;

export const salonServiceCatalog: Service[] = [
  { id: 1,  salonId: 0, serviceName: "Мужская стрижка",           durationMinutes: 45,  price: 550,  isActive: true, createdAt: "", updatedAt: "" },
  { id: 2,  salonId: 0, serviceName: "Стрижка под насадку",      durationMinutes: 30,  price: 350,  isActive: true, createdAt: "", updatedAt: "" },
  { id: 3,  salonId: 0, serviceName: "Оформление бороды",        durationMinutes: 20,  price: 300,  isActive: true, createdAt: "", updatedAt: "" },
  { id: 4,  salonId: 0, serviceName: "Детская модельная",        durationMinutes: 30,  price: 450,  isActive: true, createdAt: "", updatedAt: "" },
  { id: 5,  salonId: 0, serviceName: "Александровская скидка",   durationMinutes: 10,  price: 50,   isActive: true, createdAt: "", updatedAt: "" },
  { id: 6,  salonId: 0, serviceName: "Пилинг кожи головы",       durationMinutes: 40,  price: 500,  isActive: true, createdAt: "", updatedAt: "" },
  { id: 7,  salonId: 0, serviceName: "Мытье головы",             durationMinutes: 15,  price: 100,  isActive: true, createdAt: "", updatedAt: "" },
  { id: 8,  salonId: 0, serviceName: "Подравнивание усов, бровей", durationMinutes: 15, price: 200,  isActive: true, createdAt: "", updatedAt: "" },
  { id: 9,  salonId: 0, serviceName: "Модельная стрижка",        durationMinutes: 60,  price: 750,  isActive: true, createdAt: "", updatedAt: "" },
  { id: 10, salonId: 0, serviceName: "Подравнивание волос",      durationMinutes: 30,  price: 500,  isActive: true, createdAt: "", updatedAt: "" },
  { id: 11, salonId: 0, serviceName: "Окрашивание ресниц",       durationMinutes: 30,  price: 250,  isActive: true, createdAt: "", updatedAt: "" },
  { id: 12, salonId: 0, serviceName: "Оформление, окрашивание бровей", durationMinutes: 30, price: 500, isActive: true, createdAt: "", updatedAt: "" },
  { id: 13, salonId: 0, serviceName: "Химическая завивка",       durationMinutes: 120, price: 2100, isActive: true, createdAt: "", updatedAt: "" },
  { id: 14, salonId: 0, serviceName: "Состав",                   durationMinutes: 30,  price: 600,  isActive: true, createdAt: "", updatedAt: "" },
  { id: 15, salonId: 0, serviceName: "Окрашивание волос в один тон", durationMinutes: 90, price: 1750, isActive: true, createdAt: "", updatedAt: "" },
  { id: 16, salonId: 0, serviceName: "Стоимость краски",          durationMinutes: 0,   price: 10,  isActive: true, createdAt: "", updatedAt: "" },
  { id: 17, salonId: 0, serviceName: "Мелирование + тонирование", durationMinutes: 120, price: 2250, isActive: true, createdAt: "", updatedAt: "" },
  { id: 18, salonId: 0, serviceName: "Колорирование",            durationMinutes: 120, price: 2750, isActive: true, createdAt: "", updatedAt: "" },
  { id: 19, salonId: 0, serviceName: "Dipity blond с растяжкой цвета", durationMinutes: 150, price: 2750, isActive: true, createdAt: "", updatedAt: "" },
  { id: 20, salonId: 0, serviceName: "Стоимость 1 колпачка",     durationMinutes: 0,   price: 350,  isActive: true, createdAt: "", updatedAt: "" },
  { id: 21, salonId: 0, serviceName: "Полировка волос",          durationMinutes: 60,  price: 1000, isActive: true, createdAt: "", updatedAt: "" },
  { id: 22, salonId: 0, serviceName: "Мытье головы + сушка",     durationMinutes: 30,  price: 700,  isActive: true, createdAt: "", updatedAt: "" },
];

export const salonHairdressers: Record<number, Hairdresser[]> = {
  1: [
    { id: "c2195a1d-a809-44a6-aaa5-1d313172078f",    username: "Анна",    isActive: true, createdAt: "", updatedAt: "" },
    { id: "51517287-2fc6-4f87-a5ed-28c12d6a8095",   username: "Елена",   isActive: true, createdAt: "", updatedAt: "" },
    { id: "c2195a1d-a809-44a6-aaa5-1d313172078c",   username: "Мария",   isActive: true, createdAt: "", updatedAt: "" },
  ],
  2: [
    { id: "51517287-2fc6-4f87-a5ed-28c12d6a8095",  username: "Дмитрий", isActive: true, createdAt: "", updatedAt: "" },
    { id: "51517287-2fc6-4f87-a5ed-28c12d6a8095",  username: "Алексей", isActive: true, createdAt: "", updatedAt: "" },
  ],
};

const weekdayMap: Record<string, number> = {
  monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 7,
};

function parseShift(s: string): { start: string; end: string } {
  const [start, end] = s.split("-");
  return { start: start.trim() + ":00", end: end.trim() + ":00" };
}

export function buildWorkPatterns(
  salonId: number,
  schedule: Record<string, string>,
): HairdresserWorkPattern[] {
  const patterns: HairdresserWorkPattern[] = [];
  const hairdressers = salonHairdressers[salonId] ?? [];
  for (const h of hairdressers) {
    for (const [day, range] of Object.entries(schedule)) {
      const { start, end } = parseShift(range);
      patterns.push({
        id: patterns.length + 1,
        hairdresserId: h.id,
        salonId,
        weekday: weekdayMap[day],
        shiftStart: start,
        shiftEnd: end,
        effectiveFrom: "",
        createdAt: "",
      });
    }
  }
  return patterns;
}

export function getServiceById(id: number): Service | undefined {
  return salonServiceCatalog.find((s) => s.id === id);
}
