import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';
import { IoChevronBackOutline } from "react-icons/io5";   // ✅ back arrow icon

const ProfilePage = () => {
  const {authUser, updateProfile} = useContext(AuthContext);  
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
    <div className='min-h-screen bg-cover bg-no-repeat flex flex-col items-center justify-center relative'>

      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
      <IoChevronBackOutline onClick={() => navigate(-1)} className='absolute top-5 left-5 text-2xl text-gray-400 cursor-pointer hover:text-white transition' />
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-blue-300">Profile Details</h3>
          </div>

          

           {/* Name Field */}
           <div className="flex flex-col gap-1">
             <label htmlFor="name" className="text-sm font-medium text-gray-400">Name</label>
             <input 
               id="name" onChange={(e) => setName(e.target.value)} value={name} type="text" required placeholder="Your Name" 
               className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
           </div>

           {/* Bio Field */}
           <div className="flex flex-col gap-1">
             <label htmlFor="bio" className="text-sm font-medium text-gray-400">Bio</label>
               <textarea id="bio" onChange={(e) => setBio(e.target.value)} value={bio} rows={4} 
               className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Your bio..."></textarea>
           </div>

          {/* Submit Button */}
          <button type="submit" className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'>Save</button>
        </form>
        <div><img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} src={authUser?.profilePic || assets.logo_icon} alt="" />
        <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer hover:opacity-80'>
            <input onChange={(e) => setSelectedImg(e.target.files[0])} type="file" id="avatar" accept='.png, .jpg, .jpeg' hidden/>
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`}/>
            Update Profile Image
          </label></div>
        
      </div>
    </div>
  );
};

export default ProfilePage;
