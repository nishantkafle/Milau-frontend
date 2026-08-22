import React, { useState } from 'react';
import { LiaUserEditSolid } from 'react-icons/lia';
import { FaSignOutAlt } from 'react-icons/fa';
import { FaUserCircle, FaLock } from 'react-icons/fa'; // Import additional icons
import ProfileSettings from './ProfileSetting/ProfileSetting';
import ChangePassword from './ProfileSetting/ChangePassword';
import { logoutUserApi } from '../../Apis/Api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AccountSetting = () => {
  const [activeSection, setActiveSection] = useState('accountSetting');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <div className="flex flex-wrap justify-between mb-16">
        <div className="bg-white border border-solid border-gray w-full basis-[30%] max-lg:basis-[100%] p-6 max-sm:p-4 rounded-sm">
          <button className="lg:hidden" onClick={toggleDropdown}>
            <i className={`fa fa-bars text-[25px] ${isDropdownOpen ? 'hidden' : ''}`} aria-hidden="true"></i>
          </button>
          <div className={`lg:flex-col lg:hidden ${isDropdownOpen ? 'block' : 'hidden'}`}>
            <p className="font-bold text-xl mt-4 lg:mt-0 lg:text-2xl mb-4">Settings</p>
            <div className="flex flex-col gap-2">
              <div
                className={`flex gap-2 cursor-pointer items-center p-2 lg:mb-4 ${
                  activeSection === 'accountSetting' ? 'border-l-4 bg-[#FFDCD0] border-solid border-[#8B0000]' : 'hover:bg-[#FFDCD0] hover:text-[#8B0000] transition-all duration-150 ease-in-out'
                }`}
                onClick={() => handleSectionClick('accountSetting')}
              >
                <FaUserCircle className="text-[25px]" />
                <p className="lg:text-lg">Account Setting</p>
              </div>
              <div
                className={`flex gap-2 cursor-pointer items-center p-2 lg:mb-4 ${
                  activeSection === 'editYourProfile' ? 'border-l-4 bg-[#FFDCD0] border-solid border-[#8B0000]' : 'hover:bg-[#FFDCD0] hover:text-[#8B0000] transition-all duration-150 ease-in-out'
                }`}
                onClick={() => handleSectionClick('editYourProfile')}
              >
                <LiaUserEditSolid className="text-[25px]" />
                <p className="lg:text-lg">Edit Your Profile</p>
              </div>
              <div
                className={`flex gap-2 cursor-pointer items-center p-2 lg:mb-4 ${
                  activeSection === 'password' ? 'border-l-4 bg-[#FFDCD0] border-solid border-[#8B0000]' : 'hover:bg-[#FFDCD0] hover:text-[#8B0000] transition-all duration-150 ease-in-out'
                }`}
                onClick={() => handleSectionClick('password')}
              >
                <FaLock className="text-[25px]" />
                <p className="lg:text-lg">Password</p>
              </div>
            </div>
          </div>
          <div className="lg:block hidden">
            <p className="font-bold text-2xl mb-4">Settings</p>
            <div className="flex flex-col gap-2">
              <div
                className={`flex gap-2 cursor-pointer items-center p-2 mb-4 ${
                  activeSection === 'accountSetting' ? 'border-l-4 bg-[#FFDCD0] border-solid border-[#8B0000]' : 'hover:bg-[#FFDCD0] hover:text-[#8B0000] transition-all duration-150 ease-in-out'
                }`}
                onClick={() => handleSectionClick('accountSetting')}
              >
                <FaUserCircle className="text-[25px]" />
                <p className="text-lg">Account Setting</p>
              </div>
              <div
                className={`flex gap-2 cursor-pointer items-center p-2 mb-4 ${
                  activeSection === 'password' ? 'border-l-4 bg-[#FFDCD0] border-solid border-[#8B0000]' : 'hover:bg-[#FFDCD0] hover:text-[#8B0000] transition-all duration-150 ease-in-out'
                }`}
                onClick={() => handleSectionClick('password')}
              >
                <FaLock className="text-[25px]" />
                <p className="text-lg">Password</p>
              </div>
             
            </div>
          </div>
        </div>

        <div className="bg-white border basis-[68%] max-sm:p-4 px-8 py-6 rounded-sm max-lg:basis-[100%] mb-6">
          {activeSection === 'accountSetting' && <ProfileSettings/>}
          {activeSection === 'password' && <ChangePassword/>}
        </div>
      </div>
    </>
  );
};

export default AccountSetting;
