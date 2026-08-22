import React from "react";
import women from "../../assets/images/women2.jpg";
import insta from "../../assets/icons/in.png";
import whatsapp from "../../assets/icons/whatsapp.png";
import women2 from "../../assets/images/women3.jpg";
import women3 from "../../assets/images/women4.jpg";
import { FaBullseye, FaEye } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 -m-5">
      <div className="space-y-10 pb-10">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-amber-100 via-orange-50 to-stone-100 border-b border-amber-200">
          <div className="container mx-auto px-4 py-12">
            <div className="bg-white/70 backdrop-blur rounded-2xl p-7 lg:p-10 border border-amber-200 shadow-lg">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-3 items-center">
                    <span className="px-4 py-1.5 bg-amber-600 text-white text-sm font-medium rounded-full">
                      Since 2018
                    </span>
                    <span className="px-4 py-1.5 bg-white border-2 border-amber-600 text-amber-900 text-sm font-medium rounded-full">
                      Mero Pahiran. Mero Pahichan.
                    </span>
                  </div>
                  <div className="space-y-4">
                    <h1 className="text-4xl lg:text-5xl font-bold text-amber-950 leading-tight">
                      The story behind Pranu Collection
                    </h1>
                    <p className="text-lg text-amber-900 leading-relaxed">
                      Born in Kathmandu, Pranu Collection is a women's ethnic
                      wear label that celebrates confidence, independence, and
                      everyday elegance. Each piece is thoughtfully crafted to
                      make you feel seen, comfortable, and beautifully yourself.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-center">
                      <div className="text-3xl font-bold text-amber-600">
                        95%
                      </div>
                      <div className="text-sm text-amber-900 mt-1">
                        Customer satisfaction
                      </div>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-center">
                      <div className="text-3xl font-bold text-amber-600">
                        3+
                      </div>
                      <div className="text-sm text-amber-900 mt-1">
                        Locations
                      </div>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-center">
                      <div className="text-3xl font-bold text-amber-600">
                        3L+
                      </div>
                      <div className="text-sm text-amber-900 mt-1">
                        Orders completed
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="rounded-[260px] border-4 border-amber-200 bg-amber-50 p-4 shadow-lg">
                      <img
                        src={women}
                        alt="Women in kurta"
                        className="lg:h-[420px] h-[320px] w-auto object-cover rounded-[230px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Story Section */}
        <div className="container mx-auto px-4">
          <div className="bg-white/70 backdrop-blur rounded-2xl p-7 lg:p-10 border border-amber-200 shadow-md">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="inline-block px-4 py-1.5 bg-amber-100 border border-amber-300 text-amber-900 text-sm font-medium rounded-full">
                  Who we are
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-amber-950">
                  Rooted in tradition, tailored for today
                </h2>
                <p className="text-amber-900 leading-relaxed">
                  Pranu Collection specializes in elegant and versatile women's
                  kurtas that blend traditional charm with modern silhouettes.
                  From everyday essentials to statement festive pieces, we
                  design with comfort, fit, and fabric quality at the heart of
                  everything.
                </p>
                <p className="text-amber-900 leading-relaxed">
                  Our pieces are made to move with you—whether you're navigating
                  busy city streets, celebrating with loved ones, or taking a
                  quiet moment for yourself. Each stitch is a small celebration
                  of Nepali identity and feminine strength.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[women, women2, women3].map((img, index) => (
                  <div
                    key={index}
                    className="relative group overflow-hidden rounded-xl border border-amber-200 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <img
                      src={img}
                      alt={`Pranu editorial ${index + 1}`}
                      className="h-[180px] w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    <a
                      href="https://www.instagram.com/pranucollectionofficial/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-amber-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="white"
                        className="w-8 h-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.75 2h8.5A5.25 5.25 0 0121.5 7.25v8.5A5.25 5.25 0 0116.25 21H7.75A5.25 5.25 0 012.5 15.75v-8.5A5.25 5.25 0 017.75 2zM16.5 7.75a.75.75 0 10-1.5 0 .75.75 0 001.5 0zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                        />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="container mx-auto px-4">
          <div className="bg-white/70 backdrop-blur rounded-2xl p-7 lg:p-10 border border-amber-200 shadow-md">
            <h2 className="text-3xl lg:text-4xl font-bold text-amber-950 text-center mb-8">
              Mission &amp; Vision
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 flex gap-4 items-start hover:shadow-md transition-shadow">
                <span className="flex-shrink-0 p-3 bg-amber-600 text-white rounded-lg">
                  <FaBullseye className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-amber-950 mb-2">
                    Our Mission
                  </h3>
                  <p className="text-amber-900 leading-relaxed">
                    We aim to redefine ethnic wear by pairing timeless
                    aesthetics with a message of strength and individuality.
                    Every collection is designed to empower women to dress with
                    intention and pride.
                  </p>
                </div>
              </div>
              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 flex gap-4 items-start hover:shadow-md transition-shadow">
                <span className="flex-shrink-0 p-3 bg-amber-600 text-white rounded-lg">
                  <FaEye className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-amber-950 mb-2">
                    Our Vision
                  </h3>
                  <p className="text-amber-900 leading-relaxed">
                    To become a global symbol of independence, pride, and Nepali
                    heritage—one outfit at a time—while nurturing a community
                    that feels seen, celebrated, and confident.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visit Us Section */}
        <div className="container mx-auto px-4">
          <div className="bg-white/70 backdrop-blur rounded-2xl p-7 lg:p-10 border border-amber-200 shadow-md">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <span className="inline-block px-4 py-1.5 bg-amber-100 border border-amber-300 text-amber-900 text-sm font-medium rounded-full">
                  Visit our store
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-amber-950">
                  Find us in the heart of Kathmandu
                </h2>
                <p className="text-amber-900 leading-relaxed">
                  Step into our NewRoad store to experience the fabrics, colors,
                  and details up close. Our team is here to help you discover
                  silhouettes that feel made just for you.
                </p>
                <div className="space-y-3 bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <p className="text-amber-900">
                    <span className="font-semibold text-amber-950">
                      Address:
                    </span>{" "}
                    Kathmandu, Nepal, NewRoad
                  </p>
                  <p className="text-amber-900">
                    <span className="font-semibold text-amber-950">Phone:</span>{" "}
                    +977 984-8556062
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-950 mb-3">
                    Follow us
                  </h3>
                  <div className="flex gap-4 items-center">
                    <a
                      href="https://www.instagram.com/pranucollectionofficial/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-amber-100 rounded-lg hover:bg-amber-200 transition-colors border border-amber-300"
                    >
                      <img src={insta} alt="Instagram" className="h-6 w-6" />
                    </a>
                    <a
                      href="https://wa.me/9848556062"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-amber-100 rounded-lg hover:bg-amber-200 transition-colors border border-amber-300"
                    >
                      <img src={whatsapp} alt="WhatsApp" className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-amber-200 shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2782.6747408388396!2d85.3085965!3d27.7053317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1923219ab8a1%3A0x4ef7d1cc5e2ccadc!2sPranu%20Collections!5e1!3m2!1sen!2snp!4v1735123212455!5m2!1sen!2snp"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Pranu Collection Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Instagram Strip */}
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl p-7 lg:p-8 border border-amber-300 shadow-lg text-center">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3">
                <img
                  src={insta}
                  alt="Instagram"
                  className="h-8 brightness-0 invert"
                />
                <span className="valky font-bold text-xl text-white">
                  @official_pranu_collection
                </span>
              </div>
              <p className="text-amber-50 max-w-2xl mx-auto text-lg">
                Tag us in your looks for a chance to be featured. We love seeing
                how you style Pranu in your own way.
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center mt-6">
                {[women, women2, women3, women2].map((img, index) => (
                  <div
                    key={index}
                    className="relative group h-[180px] w-[180px] overflow-hidden rounded-xl border-2 border-white/20"
                  >
                    <img
                      src={img}
                      alt={`Instagram preview ${index + 1}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    <a
                      href="https://www.instagram.com/pranucollectionofficial/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-amber-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="white"
                        className="w-8 h-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.75 2h8.5A5.25 5.25 0 0121.5 7.25v8.5A5.25 5.25 0 0116.25 21H7.75A5.25 5.25 0 012.5 15.75v-8.5A5.25 5.25 0 017.75 2zM16.5 7.75a.75.75 0 10-1.5 0 .75.75 0 001.5 0zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                        />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
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
          className="block hover:scale-110 transition-transform duration-200 drop-shadow-lg"
        >
          <img src={whatsapp} alt="WhatsApp" className="h-[60px] w-[60px]" />
        </a>
      </div>
    </div>
  );
};

export default AboutUs;
