import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import fb from '../../assets/icons/fb.png';
import insta from '../../assets/icons/in.png';
import whatapp from '../../assets/icons/wa.png';
import img1 from "../../assets/images/img1.jpg";
import img2 from "../../assets/images/img1.jpg";
import img3 from "../../assets/images/img1.jpg";
import img4 from "../../assets/images/img1.jpg";
import img5 from "../../assets/images/img1.jpg";
import img6 from "../../assets/images/img1.jpg";

const Footer = () => {
  return (
    <footer className="footer-shell mt-16">
      <div className="container mx-auto px-6 py-14">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-orange-300">Pranu Collection</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-white mt-2">Crafted for the modern Nepali wardrobe</h2>
          </div>
          <a
            href="https://www.instagram.com/pranucollectionofficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Follow the journey
          </a>
        </div>

        <div className="footer-grid mt-10">
          <div className="space-y-3">
            <h3 className="footer-title">Pranu Collection</h3>
            <p className="text-sm text-slate-300 italic">Mero Pahiran Mero Pahichan</p>
            <p className="text-sm text-slate-400">Kathmandu, Nepal, NewRoad</p>
            <p className="text-sm text-slate-400">+977 984-8556062</p>
            <div className="flex gap-4 pt-2">
              <a href="https://www.facebook.com/pranucollection" target="_blank" rel="noopener noreferrer">
                <img src={fb} alt="facebook" className="h-[28px] grayscale hover:grayscale-0 transition" />
              </a>
              <a href="https://www.instagram.com/pranucollectionofficial/" target="_blank" rel="noopener noreferrer">
                <img src={insta} alt="instagram" className="h-[26px] grayscale hover:grayscale-0 transition" />
              </a>
              <a aria-label="Chat on WhatsApp" href="https://wa.me/9848556062" target="_blank" rel="noopener noreferrer">
                <img src={whatapp} alt="whatsapp" className="h-[30px] grayscale hover:grayscale-0 transition" />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="footer-title">Support</h3>
            <Link to="/faq" className="footer-link block">Information</Link>
            <Link to="/faq" className="footer-link block">Payment</Link>
            <Link to="/termsandcondition" className="footer-link block">Terms & Conditions</Link>
          </div>

          <div className="space-y-3">
            <h3 className="footer-title">Company</h3>
            <Link to="/about" className="footer-link block">About Us</Link>
            <Link to="/about" className="footer-link block">Contact</Link>
          </div>

          <div className="space-y-3">
            <h3 className="footer-title">Instagram</h3>
            <p className="text-sm text-slate-400">Follow or tag us with #pranucollection, @pranucollection</p>
            <div className="grid grid-cols-3 gap-2">
              {[img1, img2, img3, img4, img5, img6].map((img, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg border border-white/5">
                  <img src={img} alt={`img${index + 1}`} className="h-[100px] object-cover w-[100%] transition duration-500 group-hover:scale-110" />
                  <a
                    href="https://www.instagram.com/pranucollectionofficial/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className="w-8 h-8">
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

        <div className="flex flex-wrap items-center justify-between gap-4 pt-10 mt-6 border-t border-white/10 text-sm text-slate-400">
          <span>© 2022 Pranu Collection. All rights reserved.</span>
          <span className="pill ghost">Crafted with care in Kathmandu</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
