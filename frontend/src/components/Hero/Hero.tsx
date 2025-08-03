import { FunctionComponent, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import 'swiper/css';
import styles from './Hero.module.sass';
import { videos } from './videos';
import {Navigation} from 'swiper/modules';
import { getBasePath } from '../../../../src/misc/utils';

SwiperCore.use([Navigation]);

export type Video = {
    video: string;
    texts: { first: string; second: string };
}

const basePath = getBasePath('/videos/');

export type Videos = Video[];

export const Hero: FunctionComponent = () => {
    const [swiper, setSwiper] = useState<SwiperCore | null>(null);

    return (
        <div className={styles.swiperWrapper}>
            <span className={styles.prev} onClick={() => swiper?.slidePrev()} />
            <Swiper
                onSwiper={setSwiper}
                className={styles.slider}
                slidesPerView={1}
                loop={true}
                centeredSlides={true}
            >
                {videos.map((_, index) => (
                    <SwiperSlide key={index} className={`${styles.slide}`}>
                        <video autoPlay loop playsInline muted>
                            <source src={`${basePath  }/candles.mp4`} type="video/mp4" />
                        </video>
                    </SwiperSlide>
                ))}
                <SwiperSlide className={`${styles.slide}`}>
                    <video autoPlay loop playsInline muted>
                        <source src={`${basePath  }/heartcandles.mp4`} type="video/mp4" />
                    </video>
                </SwiperSlide>

            </Swiper>
            <span className={styles.next} onClick={() => swiper?.slideNext()} />
        </div>
    );
};
