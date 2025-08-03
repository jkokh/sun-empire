import { FunctionComponent, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import 'swiper/css';
import styles from './Carousel.module.sass';
import { stories } from './stories';
import { Navigation } from 'swiper/modules';
import { getBasePath } from '../../../../src/misc/utils';

SwiperCore.use([Navigation]);

export type Story = {
    picture: string;
    story: string;
};

const basePath = getBasePath('/images/swiper/');

export type Stories = Story[];

export const Carousel: FunctionComponent = () => {
    const [swiper, setSwiper] = useState<SwiperCore | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (swiper) {
            const changeHandler = () => {
                setActiveIndex(swiper.realIndex);
            };
            swiper.on('slideChange', changeHandler);
            return () => {
                swiper.off('slideChange', changeHandler);
            };
        }
    }, [swiper]);

    const initialSlide = Math.floor(Math.random() * stories.length);

    const handleSlideChange = (swiper: SwiperCore) => {
        setActiveIndex(swiper.realIndex);
    };

    return (
        <div className={styles.swiperWrapper}>
            <span className={styles.prev} onClick={() => swiper?.slidePrev()} />
            <Swiper
                className={styles.slider}
                onSwiper={setSwiper}
                slidesPerView={1}
                centeredSlides={false}
                breakpoints={{
                    700: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    1024: {
                        slidesPerView: 3,
                        centeredSlides: true,
                        spaceBetween: 40,
                    },
                }}
                loop={true}
                onSlideChange={handleSlideChange}
                initialSlide={initialSlide}
            >
                {stories.map((story, index) => (
                    <SwiperSlide key={index} className={`${styles.slide} ${index === activeIndex ? styles.isActive : ''}`}>
                        <div className={styles.imageWrapper}>
                            <div className={styles.imageBlur} style={{ backgroundImage: `url(${basePath + story.picture})` }} />
                            <div className={styles.image} style={{ backgroundImage: `url(${basePath + story.picture})` }} />
                        </div>
                        <div className={styles.text}>{story.story}</div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <span className={styles.next} onClick={() => swiper?.slideNext()} />
        </div>
    );
};
