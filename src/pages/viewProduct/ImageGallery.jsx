import React, { useState, useEffect } from 'react';
import { baseURL } from '../../Apis/Api';

const ImageGallery = ({ images }) => {
  const [largeImage, setLargeImage] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);

  // Update largeImage when images prop changes
  useEffect(() => {
    if (images && images.length > 0) {
      setLargeImage(`${baseURL}/${images[0]}`);
    }
  }, [images]);

  // Handle click on thumbnail
  const handleImageClick = (image) => {
    // Check if the image already contains the baseURL
    const finalImage = image.includes(baseURL) ? image : `${baseURL}/${image}`;
    setLargeImage(finalImage);
  };

  // Limit thumbnails to four images
  const thumbnailImages = images?.slice(0, 4) || [];
  const remainingImages = images?.slice(3) || [];
  const remainingImagesCount = remainingImages.length;

  // Open modal with remaining images
  const handleOpenModal = () => {
    setModalImages(remainingImages.map(image => `${baseURL}/${image}`));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalImages([]);
  };

  return (
    <div className='p-5 lg:flex justify-end gap-2 lg:h-[650px] h-[400px'>
      
      {/* Thumbnail Images */}
      <div className='lg:grid grid-rows-4  gap-2 w-[100px] hidden'>
        {thumbnailImages.length > 0 ? (
          thumbnailImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={`${baseURL}/${image}`}
                alt={`Thumbnail ${index + 1}`}
                className='h-[150px] cursor-pointer hover:border-2 hover:border-red-400 rounded-md w-[100px] object-cover border '
                onClick={() => handleImageClick(image)}
              />
              {index === 3 && remainingImagesCount > 0 && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center text-lg font-bold rounded-md cursor-pointer"
                  onClick={handleOpenModal}
                >
                  +{remainingImagesCount}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>

      {/* Large Image */}
      <div className='lg:h-[650px] h-[400px] w-[100%] lg:w-[400px] overflow-hidden'>
        {largeImage ? (
          <img
            src={largeImage}
            alt="Large display"
            className='object-contain lg:w-full h-full lg:object-cover rounded-md transition-transform duration-300 ease-in-out border  border-gray-200 '
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500">
            No Image Available
          </div>
        )}
      </div>

      {/* Mobile Thumbnails */}
      <div className='lg:hidden flex gap-2 w-[100%] pt-5 '>
        {thumbnailImages.length > 0 ? (
          thumbnailImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={`${baseURL}/${image}`}
                alt={`Thumbnail ${index + 1}`}
                className='lg:h-[100%] h-[70px]  cursor-pointer hover:border-2 hover:border-red-400 rounded-md w-full object-cover'
                onClick={() => handleImageClick(image)}
              />
              {index === 3 && remainingImagesCount > 0 && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center text-lg font-bold"
                  onClick={handleOpenModal}
                >
                  +{remainingImagesCount}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>

      {/* Modal for Remaining Images */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-md max-w-3xl w-full max-h-[90%] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Remaining Images</h2>
              <button
                className="text-red-500 hover:text-red-700 font-bold"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {modalImages.length > 0 ? (
                modalImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Modal Image ${index + 1}`}
                    className="w-full h-full object-cover rounded-md cursor-pointer"
                    onClick={() => {
                      handleImageClick(image); // Set the large image
                      handleCloseModal(); // Close the modal
                    }}
                  />
                ))
              ) : (
                <p>No images available</p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ImageGallery;
