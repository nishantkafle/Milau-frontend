// src/pages/component/TermsAndConditions.jsx
import React from 'react';
import insta from '../assets/icons/in.png';
import whatapp from '../assets/icons/wa.png';
const TermsAndConditions = () => {
    return (
        <div>
            <div
                className="fixed top-0 left-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('https://via.placeholder.com/1920x1080')` }} // Placeholder bg, replace with your actual background image
            ></div>

            <div className="relative mx-auto">
                <div className="bg-[#E3DCD7]">
                    <div className="container mx-auto pt-16 pb-12">
                        <div className="text-center">
                            <h1 className="text-4xl font-extrabold text-gray-800 mb-4 valky">Terms and Conditions</h1>
                            <p className="text-xl text-gray-600">Welcome to Pranu Collection. By accessing or using our services, you agree to the following terms and conditions.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white px-10 py-14">
                    <div className="container mx-auto">
                        <div className="space-y-8 text-gray-700 leading-relaxed">

                            {/* Introduction */}
                            <div>
                                <h2 className="text-2xl font-bold text-[#AB3430]">1. Introduction</h2>
                                <p>
                                    These Terms and Conditions govern your use of our website and services. By using our website, you agree to comply with these terms and conditions.
                                </p>
                            </div>

                            {/* Usage of Site */}
                            <div>
                                <h2 className="text-2xl font-bold text-[#AB3430]">2. Usage of the Site</h2>
                                <p>
                                    You agree to use this website only for lawful purposes and in a manner that does not infringe upon the rights of others or restrict their use of the site.
                                </p>
                            </div>

                            {/* Account Registration */}
                            <div>
                                <h2 className="text-2xl font-bold text-[#AB3430]">3. Account Registration</h2>
                                <p>
                                    You may need to register for an account to access certain features of the website. You agree to provide accurate, current, and complete information during the registration process and to update such information as necessary.
                                </p>
                            </div>

                            {/* Payment Methods */}
                            <div>
                                <h2 className="text-2xl font-bold text-[#AB3430]">4. Payment Methods</h2>
                                <p>
                                    We accept payments through various methods. Please refer to our checkout page for the list of accepted payment methods. All transactions are secure and processed with the highest level of security.
                                </p>
                            </div>

                            {/* Privacy Policy */}
                            <div>
                                <h2 className="text-2xl font-bold text-[#AB3430]">5. Privacy Policy</h2>
                                <p>
                                    We are committed to protecting your privacy. Our Privacy Policy outlines how we collect and use your personal information. Please review our Privacy Policy for more details.
                                </p>
                            </div>

                            {/* Shipping and Delivery */}
                            <div>
                                <h2 className="text-2xl font-bold text-[#AB3430]">6. Shipping and Delivery</h2>
                                <p>
                                    We offer various shipping options for your convenience. Shipping rates and delivery times will vary depending on the location and the shipping method you select at checkout.
                                </p>
                            </div>

                            {/* Return and Refund Policy */}
                            <div>
                                <h2 className="text-2xl font-bold text-[#AB3430]">7. Return and Refund Policy</h2>
                                <p>
                                    You can return any unopened item within 7 days for a full refund. Please review our full Return and Refund Policy for more information.
                                </p>
                            </div>

                            {/* Limitation of Liability */}
                            <div>
                                <h2 className="text-2xl font-bold text-[#AB3430]">8. Limitation of Liability</h2>
                                <p>
                                    We are not liable for any direct or indirect damages arising from your use of the website, including damages caused by third-party links, products, or services.
                                </p>
                            </div>

                            {/* Governing Law */}
                            <div>
                                <h2 className="text-2xl font-bold text-[#AB3430]">9. Governing Law</h2>
                                <p>
                                    These terms are governed by the laws of the country in which Pranu Collection is registered. Any disputes will be subject to the jurisdiction of the courts in that country.
                                </p>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h2 className="text-2xl font-bold text-[#AB3430]">10. Contact Information</h2>
                                <p>
                                    If you have any questions regarding these Terms and Conditions, please contact us at <strong>info@pranucollection.com</strong> or reach us through the contact details provided on our website.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="bg-[#F2F2F2] py-6 text-center">
                    <div className="container mx-auto">
                        <h3 className="text-2xl font-semibold text-gray-800">Follow Us</h3>
                        <p className="text-lg text-gray-600 mt-2">Stay updated with the latest news and collections.</p>

                        <div className="flex justify-center gap-6 mt-4">
                            <a href="https://www.instagram.com/pranucollectionofficial/" target="_blank" rel="noopener noreferrer">
                                <img src={insta} alt="Instagram" className="h-10" />
                            </a>
                            <a href="https://wa.me/9848556062" target="_blank" rel="noopener noreferrer">
                                <img src={whatapp} alt="WhatsApp" className="h-10" />
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TermsAndConditions;
