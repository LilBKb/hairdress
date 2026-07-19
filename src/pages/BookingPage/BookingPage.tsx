import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import BackButton from "../../components/BackButton/BackButton";
import { ServiceSelector } from "../../components/ServiceSelector/ServiceSelector";
import { HairdresserSelector } from "../../components/HairdresserSelector/HairdresserSelector";
import { TimeSlotPicker } from "../../components/TimeSlotPicker/TimeSlotPicker";
import {
  SALON_IDS,
  salonServiceCatalog,
  salonHairdressers,
  buildWorkPatterns,
  getServiceById,
} from "../../data/salons";
import { branches } from "../../data/branches";
import {
  redFoxLinks,
  barbershopLinks,
} from "../../data/links";
import {
  useAppDispatch,
  useAppSelector,
} from "../../store/hooks";
import {
  logout,
} from "../../store/slices/userSlice";
import {
  cancelBooking,
  createBooking,
  fetchMyBookings,
} from "../../store/slices/bookingSlice";
import styles from "./styles.module.css";
import type { Hairdresser, Service } from "../../interface/interface";

const STEPS = ["Услуга", "Мастер", "Дата и время", "Подтверждение"];

export default function BookingPage() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.user);
  const { bookings, loading, error } = useAppSelector((s) => s.booking);

  const isRedFox = location.pathname.includes("redFox");
  const salonId = isRedFox ? SALON_IDS.redFox : SALON_IDS.barbershop;
  const branch = branches[isRedFox ? 0 : 1];
  const brandColor = branch.color;
  const links = isRedFox ? redFoxLinks : barbershopLinks;

  const [tab, setTab] = useState<"create" | "my">("create");
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedHairdresser, setSelectedHairdresser] = useState<Hairdresser | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const hairdressers = salonHairdressers[salonId] ?? [];
  const workPatterns = useMemo(
    () => buildWorkPatterns(salonId, branch.workSchedule),
    [salonId, branch.workSchedule],
  );

  useEffect(() => {
    if (user && tab === "my") {
      dispatch(fetchMyBookings(user.username));
    }
  }, [dispatch, user, tab]);

  const handleCreate = async () => {
    if (!user || !selectedService || !selectedHairdresser || !selectedDate || !selectedSlot) return;

    const startsAt = new Date(selectedDate);
    const [h, m] = selectedSlot.split(":").map(Number);
    startsAt.setHours(h, m, 0, 0);

    const endsAt = new Date(startsAt.getTime() + selectedService.durationMinutes * 60000);

    const result = await dispatch(
      createBooking({
        username: user.username,
        hairdresser_id: selectedHairdresser.id,
        service_id: selectedService.id,
        salon_id: salonId,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        description,
        status: "BOOKING_STATUS_PENDING",
      }),
    );

    if (createBooking.fulfilled.match(result)) {
      setSuccessMsg("Запись создана!");
      setStep(0);
      setSelectedService(null);
      setSelectedHairdresser(null);
      setSelectedDate(null);
      setSelectedSlot(null);
      setDescription("");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const userBookings = useMemo(
    () => bookings.filter((b) => b.username === user?.username),
    [bookings, user],
  );

  const canProceed =
    (step === 0 && selectedService) ||
    (step === 1 && selectedHairdresser) ||
    (step === 2 && selectedDate && selectedSlot);

  if (!user) {
    return (
      <div className={styles.page}>
        <Header
          links={links}
          user={null}
          onLogout={() => {}}
          contactInfo={{
            name: branch.name,
            color: brandColor,
            phone: branch.contacts.phone,
            address: branch.contacts.address,
            link: branch.contacts.link,
            workSchedule: branch.workSchedule,
          }}
        />
        <BackButton to={branch.url} />
        <div className={styles.content}>
          <div className={styles.notLoggedIn}>
            <h2>Войдите, чтобы записаться</h2>
            <p>Для записи на услугу необходимо авторизоваться.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header
        links={links}
        user={user}
        onLogout={() => dispatch(logout())}
        contactInfo={{
          name: branch.name,
          color: brandColor,
          phone: branch.contacts.phone,
          address: branch.contacts.address,
          link: branch.contacts.link,
          workSchedule: branch.workSchedule,
        }}
      />
      <BackButton to={branch.url} />

      <div className={styles.content}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "create" ? styles.activeTab : ""}`}
            onClick={() => setTab("create")}
            style={tab === "create" ? { borderBottomColor: brandColor } : undefined}
          >
            Записаться
          </button>
          <button
            className={`${styles.tab} ${tab === "my" ? styles.activeTab : ""}`}
            onClick={() => setTab("my")}
            style={tab === "my" ? { borderBottomColor: brandColor } : undefined}
          >
            Мои записи
          </button>
        </div>

        {successMsg && (
          <div className={styles.success} style={{ background: brandColor }}>
            {successMsg}
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        {tab === "create" && (
          <div className={styles.form}>
            <div className={styles.steps}>
              {STEPS.map((label, i) => (
                <button
                  key={label}
                  className={`${styles.step} ${i === step ? styles.activeStep : ""} ${i < step ? styles.completedStep : ""}`}
                  onClick={() => i <= step && setStep(i)}
                  style={i === step ? { color: brandColor } : undefined}
                >
                  {i < step ? "✓" : i + 1}. {label}
                </button>
              ))}
            </div>

            {step === 0 && (
              <ServiceSelector
                services={salonServiceCatalog}
                selectedId={selectedService?.id ?? null}
                onSelect={(s) => {
                  setSelectedService(s);
                  setSelectedSlot(null);
                }}
                brandColor={brandColor}
              />
            )}

            {step === 1 && (
              <HairdresserSelector
                hairdressers={hairdressers}
                selectedId={selectedHairdresser?.id ?? null}
                onSelect={(h) => {
                  setSelectedHairdresser(h);
                  setSelectedSlot(null);
                }}
                brandColor={brandColor}
              />
            )}

            {step === 2 && selectedService && selectedHairdresser && (
              <TimeSlotPicker
                workPatterns={workPatterns}
                occupiedSlots={[]}
                serviceDuration={selectedService.durationMinutes}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onDateSelect={setSelectedDate}
                onSlotSelect={setSelectedSlot}
                brandColor={brandColor}
              />
            )}

            {step === 3 && selectedService && selectedHairdresser && selectedDate && selectedSlot && (
              <div className={styles.confirm}>
                <h3 className={styles.confirmTitle}>Подтверждение записи</h3>
                <div className={styles.confirmDetails}>
                  <div className={styles.confirmRow}>
                    <span className={styles.confirmLabel}>Услуга</span>
                    <span>{selectedService.serviceName}</span>
                  </div>
                  <div className={styles.confirmRow}>
                    <span className={styles.confirmLabel}>Мастер</span>
                    <span>{selectedHairdresser.username}</span>
                  </div>
                  <div className={styles.confirmRow}>
                    <span className={styles.confirmLabel}>Дата</span>
                    <span>
                      {selectedDate.toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                  <div className={styles.confirmRow}>
                    <span className={styles.confirmLabel}>Время</span>
                    <span>{selectedSlot}</span>
                  </div>
                  <div className={styles.confirmRow}>
                    <span className={styles.confirmLabel}>Длительность</span>
                    <span>{selectedService.durationMinutes} мин</span>
                  </div>
                  <div className={styles.confirmRow}>
                    <span className={styles.confirmLabel}>Цена</span>
                    <span style={{ fontWeight: 700, color: brandColor }}>
                      {selectedService.price} ₽
                    </span>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Комментарий (необязательно)</label>
                  <textarea
                    className={styles.textarea}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Пожелания к записи..."
                    rows={3}
                  />
                </div>

                <button
                  className={styles.submitBtn}
                  onClick={handleCreate}
                  disabled={loading}
                  style={{ background: brandColor }}
                >
                  {loading ? "Создание..." : "Подтвердить запись"}
                </button>
              </div>
            )}

            <div className={styles.navButtons}>
              {step > 0 && (
                <button
                  className={styles.backBtn}
                  onClick={() => setStep((s) => s - 1)}
                >
                  Назад
                </button>
              )}
              {step < 3 && (
                <button
                  className={styles.nextBtn}
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed}
                >
                  Далее
                </button>
              )}
            </div>
          </div>
        )}

        {tab === "my" && (
          <div className={styles.myBookings}>
            {loading && userBookings.length === 0 ? (
              <p className={styles.loadingText}>Загрузка...</p>
            ) : userBookings.length === 0 ? (
              <p className={styles.emptyText}>У вас пока нет записей</p>
            ) : (
              <div className={styles.bookingList}>
                {userBookings.map((b) => {
                  const svc = getServiceById(b.serviceId);
                  return (
                    <div key={b.id} className={styles.bookingCard}>
                      <div className={styles.bookingHeader}>
                        <span
                          className={styles.bookingStatus}
                          style={
                            b.status === "confirmed"
                              ? { color: "var(--barber)" }
                              : b.status === "cancelled"
                                ? { color: "#dc2626" }
                                : { color: brandColor }
                          }
                        >
                          {b.status === "pending"
                            ? "Ожидает"
                            : b.status === "confirmed"
                              ? "Подтверждено"
                              : b.status === "cancelled"
                                ? "Отменено"
                                : b.status === "completed"
                                  ? "Завершено"
                                  : b.status}
                        </span>
                      </div>
                      <div className={styles.bookingBody}>
                        <p className={styles.bookingService}>
                          {svc?.serviceName ?? `Услуга #${b.serviceId}`}
                        </p>
                        <p className={styles.bookingDate}>
                          {new Date(b.startsAt).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            weekday: "short",
                          })}{" "}
                          в {b.startsAt.slice(11, 16)}
                        </p>
                        {b.description && (
                          <p className={styles.bookingDesc}>{b.description}</p>
                        )}
                      </div>
                      {b.status === "pending" && (
                        <button
                          className={styles.cancelBtn}
                          onClick={() => dispatch(cancelBooking(b.id))}
                        >
                          Отменить
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
