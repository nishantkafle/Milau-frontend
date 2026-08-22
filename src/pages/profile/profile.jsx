import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import profile from "../../assets/images/defaultuser.png";
import Orders from "./Order";
import AccountSetting from "./AccountSetting";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("orders"); // Default section set to orders
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Parsed user object from localStorage:", parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing storedUser JSON:", error);
        toast.error("Failed to parse user data. Please log in again.");
      }
    } else {
      console.warn("No user data found in localStorage.");
      toast.error("User data is missing in localStorage. Please log in.");
    }
  }, []);

  // Handle switching sections (Profile, Orders, Account Settings)
  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {user ? (
        <div>
          <section className="bg-gray-300 pt-2">
            <div className="w-[80%] flex justify-between mx-auto py-6">
              <h1 className="text-gray text-xl font-bold valky">My Profile</h1>
              <p className="text-gray">
                <a href="/" className="hover:text-red-700">Home </a>/ <span className=" text-red-600 hover:text-red-700">My Profile
              </span></p>
            </div>
          </section>
          <main className="mx-auto pt-[100px]" style={{ background: 'linear-gradient(54deg, rgba(25,38,87,1) 0%, rgba(17,26,58,1) 53%, rgba(22,57,123,1) 100%)' }}>
            <section className="rounded-t-md bg-white w-[75%] max-xl:w-[80%] max-lg:w-[90%] flex flex-col justify-center mx-auto">
              <div className="p-8 flex justify-center  gap-4 items-center">
                <div className=" gap-2 text-center relative ">
                  <div className="flex justify-center top-[-100px] lg:top-[-100px] md:top-[100px] ">

                 
                  {user?.image ? (
                    <img
                      className="rounded-full h-[100px] w-[100px] bg-[white] p-2 absolute  top-[-90px] "
                      src={`${import.meta.env.VITE_APP_BASE_URI}/${user?.image}`}
                      alt="user photo"
                    />
                  ) : (
                    <img
                      className="rounded-full h-[100px] w-[100px] bg-[white] p-2 absolute  top-[-90px]"
                      src={profile}
                      alt="user photo"
                    />
                  )}
                   </div>
                  <div>
                    <h2 className="font-bold text-2xl text-center pt-5">{user.name}</h2>
                    <p className="text-[color:var(--main)] text-center">{user.email}</p>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Section Buttons for Orders, Account Settings */}
          <section className="w-[75%] max-xl:w-[80%] max-lg:w-[90%] mx-auto">
            <div className="flex mb-4 bg-white max-lg:flex-wrap border-t border-b border-solid border-orange-500 border-opacity-10">
              {[ 'account_settings','orders'].map((section) => (
                <button
                  key={section}
                  className={`py-4 w-[100%] max-lg:basis-[50%] max-sm:basis-[50%] mx-0 rounded-t-sm ${activeSection === section
                    ? 'text-red-500 font-bold border-b-4 border-solid border-red-500' // Active section: red border
                    : 'text-black-500 hover:text-[#E91631] transition-all duration-150 ease-in-out hover:border-b-4 border-solid border-orange-500' // Inactive sections: orange border
                    }`}
                  onClick={() => handleSectionClick(section)}
                >
                  {section.replace('_', ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, (match) => match.toUpperCase())}

                </button>
              ))}
            </div>
    {/* Account Settings Section */}
    {activeSection === 'account_settings' && (
                <AccountSetting/>

            )}
            {/* Orders Section */}
            {activeSection === 'orders' && (
              <div className="bg-white p-6 rounded-md shadow-lg mb-10">
                <Orders/>
              </div>
            )}

        
          </section>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
