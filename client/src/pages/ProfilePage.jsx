import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';
import { IoChevronBackOutline } from "react-icons/io5"; 
import { TbUserEdit } from "react-icons/tb";
import { LuUser } from "react-icons/lu";
import { HiOutlineMail } from "react-icons/hi";
import { LuInfo } from "react-icons/lu";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!selectedImg) {
      await updateProfile({ fullName: name, bio });
      navigate('/'); // Redirect to homepage after saving
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image, fullName: name, bio});
      navigate('/'); // Redirect to homepage after saving
    };
  };

   return (
    <div className="min-h-screen flex items-center justify-center bg-transparent bg-no-repeat relative">
      
      <IoChevronBackOutline
        onClick={() => navigate(-1)}
        className="absolute top-5 left-5 text-2xl text-gray-400 cursor-pointer hover:text-white transition"
      />


      <div className="w-full max-w-[600px] bg-transparent backdrop-blur-md rounded-2xl shadow-lg p-8 text-gray-200">

        <h3 className="text-3xl font-bold text-center text-blue-200">Profile</h3>
        <p className="text-center text-gray-500 mt-1">Your profile information</p>

        
        <div className="flex justify-center mt-6 relative">
          <img src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.logo_icon} alt="profile"
            className="w-32 h-32 rounded-full object-cover border-3 border-blue-200"
          />
          <label
            htmlFor="avatar"
            className="absolute bottom-1 left-[55%] bg-blue-200 p-2 rounded-full cursor-pointer hover:bg-gray-400 transition"
          >
            <TbUserEdit className="text-gray-800" size={24} />
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])} type="file" id="avatar" accept=".png,.jpg,.jpeg" hidden
            />
          </label>
        </div>

        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          
          <div>
            <label htmlFor="name" className="text-sm text-gray-400">
              <span><LuUser className="inline-block mr-2 mb-0.5" size={16}/></span>Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full mt-0.5 p-3 rounded-lg bg-transparent border border-gray-600 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              placeholder="Enter your name"
            />
          </div>

          <div>
          <label htmlFor="email" className="block text-sm text-gray-400">
            <span><HiOutlineMail className="inline-block mr-2 mb-0.5" size={18}/></span>Email</label>
          <input id="email" type="email" value={authUser.email} readOnly
            className="w-full mt-0.5 p-3 text-gray-400 rounded-lg bg-transparent border border-gray-600 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
        </div>
          
          <div>
            <label htmlFor="bio" className="block text-sm text-gray-400">
              <span><LuInfo className="inline-block mr-2 mb-0.5" size={16}/></span>Bio</label>
            <textarea id="bio" rows="3" value={bio} onChange={(e) => setBio(e.target.value)}
              className="w-full mt-0.5 p-3 rounded-lg bg-transparent border border-gray-600 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>

         <div className='flex justify-center'>
          <button type="submit"
              className="w-[150px] bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 rounded-full font-semibold hover:opacity-70 transition"
          >
            Save
          </button>
         </div>

        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
