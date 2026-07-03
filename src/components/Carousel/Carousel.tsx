import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./Carousel.module.css";

interface Props {
  images: { src: string; alt: string }[];
}

const Carousel = ({ images }: Props) => {
  return (
    <div className={styles.container}>
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        loop
        spaceBetween={10}
        slidesPerView={1}
        className={styles.swiper}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            <img src={img.src} alt={img.alt} className={styles.image} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
