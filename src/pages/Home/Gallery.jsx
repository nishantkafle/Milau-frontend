import React, { useEffect, useState } from "react";
import { getAllGalleryApi, getImageUrl } from "../../Apis/Api"; // Import getImageUrl helper
import whatsapp from "../../assets/icons/whatsapp.png";

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await getAllGalleryApi();
        setGallery(response.data.gallery || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load gallery");
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto"></div>
          <p className="text-amber-900 font-medium">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white/70 backdrop-blur rounded-2xl p-8 border border-amber-200 shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-16 h-16 mx-auto text-amber-400 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p className="text-amber-900 text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 -m-5">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-amber-100 via-orange-50 to-stone-100 border-b border-amber-200 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-300/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-4 py-16 text-center relative z-10">
          <div className="space-y-5">
            <span className="inline-block px-5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-semibold rounded-full shadow-lg">
              ✨ Our Collection
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold text-amber-950 valky tracking-tight">
              Gallery
            </h1>
            <p className="text-xl text-amber-900/80 max-w-2xl mx-auto leading-relaxed">
              Explore our curated collection of elegant designs and timeless
              styles
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        {gallery.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {gallery.map((item, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  {/* Image Container with aspect ratio */}
                  <div className="relative w-full pt-[125%] bg-gradient-to-br from-amber-100 to-orange-100">
                    <img
                      className="absolute inset-0 w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                      src={getImageUrl(item.image)}
                      alt={item.title || "Gallery Image"}
                      loading="lazy"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-950/90 via-amber-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                    <div className="text-center space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {item.title && (
                        <h3 className="text-white font-bold text-lg drop-shadow-lg">
                          {item.title}
                        </h3>
                      )}
                      <p className="text-amber-100 text-sm">Click to view</p>
                    </div>
                  </div>

                  {/* Decorative corner accent */}
                  <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100"></div>
                  <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/50 backdrop-blur rounded-3xl border border-amber-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-24 h-24 mx-auto text-amber-400 mb-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <p className="text-amber-900 text-xl font-semibold mb-2">
              No images in gallery yet
            </p>
            <p className="text-amber-700 text-base">
              Check back soon for new additions
            </p>
          </div>
        )}
      </div>

      {/* Image Modal/Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white hover:text-amber-400 transition-colors z-10"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="max-w-7xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center space-y-6">
            <img
              src={getImageUrl(selectedImage.image)}
              alt={selectedImage.title || "Gallery Image"}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            {selectedImage.title && (
              <h2 className="text-white text-2xl font-bold text-center drop-shadow-lg">
                {selectedImage.title}
              </h2>
            )}
            {selectedImage.description && (
              <p className="text-amber-100 text-center max-w-2xl">
                {selectedImage.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* WhatsApp Float */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          aria-label="Chat on WhatsApp"
          href="https://wa.me/9848556062"
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:scale-110 transition-transform duration-200 drop-shadow-2xl animate-bounce hover:animate-none"
        >
          <img src={whatsapp} alt="whatsapp" className="h-[60px] w-[60px]" />
        </a>
      </div>
    </div>
  );
};

export default Gallery;
