import React, { useState } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { Camera, Mail, User } from 'lucide-react';
import { useServerStore } from '../../store/useServerStore';

const ServerProfile = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const {ActiveServer} = useServerStore();

  const compressImage = (file, maxWidth = 400, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = (width * maxWidth) / height;
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      const compressedBase64 = await compressImage(file);
      if (!compressedBase64 || !compressedBase64.startsWith('data:image/')) {
        throw new Error('Invalid compressed image data');
      }
      
      setSelectedImage(compressedBase64);
      await updateProfile({ profilePic: compressedBase64 });
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    }
  };

  return (
    <div className='h-screen pt-20'>
      <div className='max-w-2xl mx-auto p-4 py-8'>
        <div className='bg-base-300 rounded-xl p-6 py-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold'>Server Profile</h1>
            <p className='mt-2'>Your Server Information</p>
          </div>
          
          <div className='flex flex-col items-center gap-4'>
            <div className='relative'>
              <img 
                src={selectedImage || authUser?.profilePic || './avatar.jpg'} 
                alt='Profile' 
                className='size-32 rounded-full object-cover border-4 mt-4'
                onError={(e) => {
                  e.target.src = './avatar.jpg';
                }}
              /> 
              <label 
                htmlFor='avatar-upload' 
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer
                transition-all duration-200 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
              >
                <Camera className='w-5 h-5 text-base-200'/>
                <input 
                  type="file" 
                  id='avatar-upload' 
                  className='hidden' 
                  accept='image/jpeg,image/jpg,image/png,image/webp' 
                  onChange={handleImageUpload} 
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            
            {isUpdatingProfile && (
              <p className='text-sm text-gray-500'>Updating profile picture...</p>
            )}
          </div>
          <div className='space-y-6'>
            <div className='space-y-1.5'>
            <div className='text-sm flex gap-2 items-center text-zinc-400'>
              Server's Name
            </div>
              <p className='px-4 py-2.5 bg-base-200  rounded-lg border'>{ActiveServer?.name}</p>
            </div>
          </div>
          <div className='space-y-6 mt-2'>
            <div className='space-y-1'>
              <div className='text-sm flex gap-2 items-center text-zinc-400'>
                Description
              </div>
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{ActiveServer?.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServerProfile
