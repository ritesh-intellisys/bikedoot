import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './BannerCarousel.css';

const BannerCarousel = ({ banners, onFindGaragesClick }) => {
  return (
    <section className="relative h-[50vh] w-full overflow-hidden">
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
        loop={banners && banners.length >= 2}
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
              <div className="relative z-10 flex items-center justify-center h-full px-2 sm:px-4">
                <div className="max-w-4xl mx-auto text-center">
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 md:mb-4 leading-tight">
                    <span className="text-white">{banner.title.split(' ')[0]}</span>
                    <span className="text-cyan-400"> {banner.title.split(' ')[1]}</span>
                    <span className="text-white"> {banner.title.split(' ').slice(2).join(' ')}</span>
                  </h1>
                  <p className="text-xs sm:text-sm md:text-lg lg:text-xl text-gray-300 mb-3 sm:mb-4 md:mb-6 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto leading-relaxed">
                    {banner.subtitle}
                  </p>
                  <div className="flex flex-row gap-1.5 sm:gap-2 md:gap-3 justify-center">
                    <button 
                      onClick={onFindGaragesClick}
                      className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-1.5 px-2 sm:py-2 sm:px-4 md:px-5 rounded-md sm:rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-xs sm:text-sm md:text-base max-w-[120px] sm:max-w-none"
                    >
                      FIND GARAGES
                    </button>
                    <button className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-semibold py-1.5 px-2 sm:py-2 sm:px-4 md:px-5 rounded-md sm:rounded-lg transition-colors duration-200 border-2 text-xs sm:text-sm md:text-base max-w-[120px] sm:max-w-none">
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
