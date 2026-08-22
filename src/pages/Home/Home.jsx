import React, { useEffect } from "react";
import whatsapp from "../../assets/icons/whatsapp.png";
import axios from "axios";
import { Link } from "react-router-dom";
import Sliders from "../component/Sliders";
import GetNewProduct from "./product/GetNewProduct";
import GetFlashSellProduct from "./product/GetFlashSellProduct";

const Home = () => {
  const featureHighlights = [
    {
      title: "Shipping",
      text: "Rs.120 inside valley, Rs.150-190 outside",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
          />
        </svg>
      ),
    },
    {
      title: "Cash on Delivery",
      text: "Try first, pay when it arrives.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
          />
        </svg>
      ),
    },
    {
      title: "Secured Payment",
      text: "SSL protected checkout and easy returns.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
      ),
    },
  ];

  const getUser = async () => {
    try {
      const response = await axios.get(
        "https://api.pranucollection.com/login/success",
        {
          withCredentials: true,
        }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
    } catch (error) {
      console.log("Google OAuth check (non-critical):", error.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 -mt-5">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-100 via-amber-50/80 to-stone-100 border-b border-amber-200/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 lg:space-y-8">
              <div className="flex flex-wrap gap-3 items-center">
                <span className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-sm font-semibold rounded-full shadow-sm">
                  New drop
                </span>
                <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-amber-900 text-sm font-medium rounded-full border border-amber-300/50 shadow-sm">
                  Mero Pahiran. Mero Pahichan.
                </span>
                <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-amber-900 text-sm font-medium rounded-full border border-amber-300/50 shadow-sm">
                  Crafted for Nepali weather
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-amber-950 leading-tight tracking-tight">
                  Elevated silhouettes
                  <span className="block text-amber-800">
                    for everyday Nepal
                  </span>
                </h1>
                <p className="text-lg lg:text-xl text-amber-900/90 leading-relaxed max-w-xl">
                  Breathable fabrics, thoughtful tailoring, and colors inspired
                  by the valley. Discover bestsellers, new arrivals, and
                  exclusive edits designed to feel good from dawn to dusk.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/category"
                  className="px-7 py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Shop categories
                </Link>
                <Link
                  to="/gallery"
                  className="px-7 py-3.5 bg-white hover:bg-amber-50 text-amber-900 font-semibold rounded-lg border-2 border-amber-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  See the lookbook
                </Link>
              </div>

              {/* Feature Highlights */}
              <div className="grid sm:grid-cols-3 gap-4 pt-6">
                {featureHighlights.map((feature, idx) => (
                  <div
                    key={idx}
                    className="group bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-amber-200/50 shadow-sm hover:shadow-lg hover:border-amber-300/70 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4">
                      <span className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 text-amber-700 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </span>
                      <div>
                        <div className="font-bold text-amber-950 text-base">
                          {feature.title}
                        </div>
                        <div className="text-sm text-amber-800/90 mt-1.5 leading-relaxed">
                          {feature.text}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Slider - Updated for full height display */}
            <div className="relative">
              <div className="bg-gradient-to-br from-white/90 to-amber-50/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/50 shadow-xl overflow-hidden">
                <div className="absolute -top-3 -right-3 w-24 h-24 bg-amber-400/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-3 -left-3 w-24 h-24 bg-amber-600/10 rounded-full blur-xl"></div>
                <div className="relative h-[500px] lg:h-[600px] rounded-xl overflow-hidden border border-amber-200/30">
                  <Sliders />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bestsellers Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-600/5 to-orange-600/5 rounded-3xl blur-2xl"></div>
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-amber-200/50 shadow-lg">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full"></div>
                  <span className="text-amber-700 font-medium text-sm uppercase tracking-wider">
                    Featured Collection
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-amber-950">
                  Bestsellers right now
                </h2>
                <p className="text-amber-800/90 text-lg max-w-2xl">
                  Crowd favorites with limited stock. Refreshed weekly with new
                  trending items.
                </p>
              </div>
              <Link
                to="/addCart"
                className="px-6 py-3 bg-gradient-to-r from-white to-amber-50 hover:from-amber-50 hover:to-amber-100 text-amber-900 font-semibold rounded-lg border-2 border-amber-600 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
              >
                View cart →
              </Link>
            </div>
            <div className="pt-4">
              <GetFlashSellProduct />
            </div>
          </div>
        </div>
      </div>

      {/* New Arrivals Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-orange-600/5 to-amber-400/5 rounded-3xl blur-2xl"></div>
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-amber-200/50 shadow-lg">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-pulse"></div>
                  <span className="text-emerald-700 font-medium text-sm uppercase tracking-wider">
                    Just Launched
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-amber-950">
                  New Arrivals
                </h2>
                <p className="text-amber-800/90 text-lg max-w-2xl">
                  Fresh drops inspired by Kathmandu streetscapes. Limited
                  edition pieces that tell a story.
                </p>
              </div>
              <Link
                to="/gallery"
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap"
              >
                Browse gallery →
              </Link>
            </div>
            <div className="pt-4">
              <GetNewProduct />
            </div>
          </div>
        </div>
      </div>

      {/* Sustainable Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-700 via-amber-600 to-orange-600"></div>

          {/* Simplified pattern background */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: "60px 60px",
              }}
            ></div>
          </div>

          <div className="relative text-center px-6 py-12 lg:py-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-full mb-6 border border-white/30">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Sustainable Picks
            </div>

            <h3 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              Feel-good fits
              <span className="block text-amber-100">made responsibly</span>
            </h3>

            <p className="text-amber-50/95 text-lg lg:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Choose pieces that last longer and stay softer. Our team handpicks
              fabrics that keep you comfortable while reducing environmental
              impact. Ethically sourced, consciously crafted.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/faq"
                className="px-7 py-3.5 bg-white hover:bg-amber-50 text-amber-900 font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Learn more
              </Link>
              <Link
                to="/category"
                className="px-7 py-3.5 bg-gradient-to-r from-amber-900/90 to-amber-950/90 hover:from-amber-900 hover:to-amber-950 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-amber-800/50"
              >
                Shop sustainable →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Float */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          aria-label="Chat on WhatsApp"
          href="https://wa.me/9848556062"
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-70 group-hover:opacity-90"></div>
            <img
              src={whatsapp}
              alt="WhatsApp"
              className="relative h-16 w-16 drop-shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
            />
          </div>
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
            !
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
