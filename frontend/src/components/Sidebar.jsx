import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';
import logo32 from '../assets/logo3-2.png';
import md5 from 'md5'; // Import the md5 library
import { categories } from '../utils/data.js';

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-grey-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';

// const categories = [
//   { name: 'Animals' },
//   { name: 'Wallpapers' },
//   { name: 'Photography' },
//   { name: 'Gaming' },
//   { name: 'Coding' },
//   { name: 'Other' }
// ];

// Helper function to get Gravatar URL
const getGravatarUrl = (email, size = 80) => {
  const hash = md5(email.trim().toLowerCase()); // Hash email to get the Gravatar hash
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
};

const Sidebar = ({ user, closeToggle }) => {
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };

  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link
          to="/"
          className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
          onClick={handleCloseSidebar}
        >
          <img src={logo32} alt="logo" className="w-full" />
        </Link>
        <div className="flex flex-col gap-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <RiHomeFill />
            Home
          </NavLink>
          <h3 className="mt-2 px-5 text-base 2xl:text-xl">Discover Categories</h3>
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              onClick={handleCloseSidebar}
              key={category.name}
            >
              <img src={category.image} alt="category" className='w-8 h-8 rounded-full shadow-sm' />
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>

      {user && (
        <Link
          to={`user/profile/${user._id}`}
          className="flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3"
          onClick={handleCloseSidebar}
        >
          <div className="flex items-center gap-2">
            {/* Use Gravatar if user email exists, else use the Google OAuth image */}
            {/* {console.log(user.email)} */}
            <img
              // src={user.email ? getGravatarUrl(user.email, 100) : user.image}
              src={user.image}
              className="w-10 h-10 rounded-full"
              alt="user-profile"
            />
            <p>{user.userName}</p>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
