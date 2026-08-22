import React from "react";
import { TECarousel, TECarouselItem } from "tw-elements-react";
import women from "../../assets/images/women4.jpg"
import women2 from "../../assets/images/women2.jpg"
import women3 from "../../assets/images/women3.jpg"





import RotatingCurvedText from '../component/RotatingCurvedText'

export default function Slider() {
  return (
    <>
      <TECarousel showControls showIndicators ride="carousel">
        <div className="relative w-full overflow-hidden after:clear-both after:block after:content-['']">
          <TECarouselItem
            itemID={1}
            className="relative float-left -mr-[100%] hidden w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none"
          >
             <div className='bg-[#E3DCD7] pt-5 pb-10'>
                    <div className='relative flex flex-col items-center'>
                        <div className='border border-gray-500 rounded-[300px] lg:w-[500px] w-[200px] md:w-[300px] overflow-hidden lg:p-[40px] p-[20px] flex items-center justify-center'>
                            <img
                                src={women}
                                alt='women in kurta'
                                className=' lg:h-[700px] h-[400px] object-cover rounded-[280px]'
                            />

                        </div>
                        <div className='absolute top-[0%] left-[50%] hidden lg:block md:block '>

                            <RotatingCurvedText className="w-[50%]" />
                        </div>
                        <div className='absolute top-[55%]'>
                            <div className='lg:text-[50px] md:text-[40px] text-[20px] text-center text-white valky '>Online and Offline</div>
                        </div>
                        <div className='absolute top-[55%]'>

                            <div className='lg:text-[200px] md:text-[100px] text-[50px] text-center text-[#AB3430] valky '>Exclusive</div>




                        </div>

                    </div>
                    <div className='absolute top-[40%] w-full px-20 hidden lg:block'><div className='flex justify-between w-full'>
                        <div>Pranu Collection features stylish kurtas<br /> for women, combining tradition with modern elegance.</div>
                        <div className='text-end w-full'>Pranu Collection<br /> features</div>
                        <div>
                        </div>
                    </div></div>

                </div>
          </TECarouselItem>
          <TECarouselItem
            itemID={2}
            className="relative float-left hidden -mr-[100%] w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none"
          >
            <div className='bg-[#E2DBD6] pt-5 pb-10'>
                    <div className='relative flex flex-col items-center'>
                        <div className='border border-gray-500 rounded-[300px] lg:w-[500px] w-[200px] md:w-[300px] overflow-hidden lg:p-[40px] p-[20px] flex items-center justify-center'>
                            <img
                                src={women2}
                                alt='women in kurta'
                                className=' lg:h-[700px] h-[400px] object-cover rounded-[280px]'
                            />

                        </div>
                        <div className='absolute top-[0%] left-[50%] hidden lg:block md:block '>

                            <RotatingCurvedText className="w-[50%]" />
                        </div>
                        <div className='absolute top-[55%]'>
                            <div className='lg:text-[50px] md:text-[40px] text-[20px] text-center text-white valky '>Must Have</div>
                        </div>
                        <div className='absolute top-[55%]'>

                            <div className='lg:text-[200px] md:text-[100px] text-[50px] text-center text-[#706946] valky '>Wisdom</div>




                        </div>

                    </div>
                    <div className='absolute top-[40%] w-full px-20 hidden lg:block'><div className='flex justify-between w-full'>
                        <div>Pranu Collection features stylish kurtas<br /> for women, combining tradition with modern elegance.</div>
                        <div className='text-end w-full'>Pranu Collection<br /> features</div>
                        <div>
                        </div>
                    </div></div>

                </div>
          </TECarouselItem>
          <TECarouselItem
            itemID={3}
            className="relative float-left -mr-[100%] hidden w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none"
          >
             <div className='bg-[#E2DBD6] pt-5 pb-10'>
                    <div className='relative flex flex-col items-center'>
                        <div className='border border-gray-500 rounded-[300px] lg:w-[500px] w-[200px] md:w-[300px] overflow-hidden lg:p-[40px] p-[20px] flex items-center justify-center'>
                            <img
                                src={women3}
                                alt='women in kurta'
                                className=' lg:h-[700px] h-[400px] object-cover rounded-[280px]'
                            />

                        </div>
                        <div className='absolute top-[0%] left-[50%] hidden lg:block md:block '>

                            <RotatingCurvedText className="w-[50%]" />
                        </div>
                        <div className='absolute top-[55%]'>
                            <div className='lg:text-[50px] md:text-[40px] text-[20px] text-center text-white valky '>New</div>
                        </div>
                        <div className='absolute top-[55%]'>

                            <div className='lg:text-[200px] md:text-[100px] text-[50px] text-center text-[#b49076] valky '>Collection</div>




                        </div>

                    </div>
                    <div className='absolute top-[40%] w-full px-20 hidden lg:block'><div className='flex justify-between w-full'>
                        <div>Pranu Collection features stylish kurtas<br /> for women, combining tradition with modern elegance.</div>
                        <div className='text-end w-full'>Pranu Collection<br /> features</div>
                        <div>
                        </div>
                    </div></div>

                </div>
          </TECarouselItem>
        </div>
      </TECarousel>
    </>
  );
}