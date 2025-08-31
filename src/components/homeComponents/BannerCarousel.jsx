import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const BannerCarousel = ({ banners }) => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        loop={true}
        className="h-full w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative h-full w-full">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${banner.image})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>
              </div>
              <div className="relative z-10 flex items-center justify-center h-full px-4">
                <div className="max-w-4xl mx-auto text-center">
                  <h1 className="text-5xl md:text-7xl font-bold mb-6">
                    <span className="text-white">{banner.title.split(' ')[0]}</span>
                    <span className="text-cyan-400"> {banner.title.split(' ')[1]}</span>
                    <span className="text-white"> {banner.title.split(' ').slice(2).join(' ')}</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                    {banner.subtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-gradient-to-r from-pink-700 to-pink-800 hover:from-pink-800 hover:to-pink-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                      FIND GARAGES
                    </button>
                    <button className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-200 border-2">
                      VIEW PRICES
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default BannerCarousel;
