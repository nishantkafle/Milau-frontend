import React, { useEffect, useState } from "react";
import { TECarousel, TECarouselItem } from "tw-elements-react";
import { baseURL, getAllBannersApi } from "../../Apis/Api";

export default function Sliders() {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await getAllBannersApi();
        if (response && response.data && response.data.banners) {
          setBanners(response.data.banners || []);
        } else {
          setBanners([]);
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error);
        setBanners([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-[260px] flex items-center justify-center text-sm text-slate-400">
        Loading highlights...
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="w-full h-[260px] flex items-center justify-center text-sm text-slate-400">
        No banners available
      </div>
    );
  }

  return (
    <TECarousel TECarousel showControls showIndicators ride="carousel">
      <div className="relative w-full overflow-hidden after:clear-both after:block after:content-['']">
        {banners.map((banner, index) => (
          <TECarouselItem
            key={index}
            itemID={index + 1} // Ensure unique IDs for each item
            className="relative float-left -mr-[100%] hidden w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none"
          >
            {/*           
          <div className={`bg-[url(${baseURL}/${banner.image})]`}
          // style={{backgroundImage: `url('${baseURL}/${banner.image}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',width:'100%',height:'100%'}}
          alt={banner.title || `Slide ${index + 1}`}
          
          > */}
            <div className="absolute top-0 left-0 w-full h-full z-[-1] animate-fade-in translate-x-1 ">
              <img
                src={`${baseURL}/${banner.image}`}
                alt={banner.title || `Slide ${index + 1}`}
                className="h-full w-full blur-md object-cover"
              />
            </div>
            <img
              src={`${baseURL}/${banner.image}`}
              alt={banner.title || `Slide ${index + 1}`}
              className="w-[100%] m-auto h-[100%] lg:object-contain md:object-contain object-fill"
            />
          </TECarouselItem>
        ))}
      </div>
    </TECarousel>
  );
}
