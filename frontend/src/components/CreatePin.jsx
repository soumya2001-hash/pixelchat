import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { client } from '../client.js';
import Spinner from './Spinner.jsx';
import { categories } from '../utils/data.js';

const CreatePin = ({user}) => {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  // const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false)

  const navigate = useNavigate();

  const uploadImage = (event) => {
    const {type, name} = event.target.files[0];
    if(type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tif'){
      setWrongImageType(false)
      setLoading(true)
      client.assets
      .upload('image', event.target.files[0], {contentType: event.target.files[0].type, filename:name})
      .then((document) => {
        setImageAsset(document)
        setLoading(false)
      })
      .catch((error) => {
        console.log('Image upload error', error);
      })
    }else{
      setWrongImageType(true)
    }
  }

  const savePin = () => {
    console.log(title, about, imageAsset._id, category);
    if(title && about && imageAsset?._id && category){
      const doc = {
        _type: 'pin',
        title: title,
        about: about,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id
          }
        },
        userID: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id
        },
        category,
      }

      client.create(doc)
      .then(() => {
        navigate('/')
      })
    }
    else{
      setFields(true);
      setTimeout(() => setFields(false), 2000, )
    }
  }

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {fields && (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>
          Please fill in all the fields
        </p>
      )}
      <div className=' felx lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
        <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
          <div className='flex justify-center items-center flex-col b-2 border-dotted border-gray-300 p-3 w-full h-420'>
            {
              loading && (
                <Spinner />
              )
            }
            {
              wrongImageType && (
                <p>Wrong Image Type</p>
              )
            }
            {!imageAsset ? (
              <label>
                <div className='flex flex-col items-center justify-center h-full cursor-pointer'>
                  <div className='flex flex-col justify-center items-center'>
                    <p className='font-bold text-2xl'>
                      <AiOutlineCloudUpload />
                    </p>
                    <p className='text-lg'>
                      Click to upload
                    </p>
                  </div>
                  <p className='mt-32 text-gray-400'>
                    Use high quality JPEG, SVG, PNG, GIF less than 20 MB
                  </p>
                </div>
                <input type='file'
                name='upload-image'
                onChange={uploadImage}
                className='w-0 h-0' />
              </label>
            ) : (
              <div className='relative h-full'>
                <img src={imageAsset?.url} alt="uploaded-image" className='h-full w-full' />
                <button type='button' className='absolute botton-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out' onClick={() => setImageAsset(null)}>
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full' >
            <input 
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder='Add your title' 
            className='outline-none text-xl sm:text-3xl font-bold border-b-2 border-grey-200 p-2'/>
            {user && (
              <div className='flex gap-2 my-2 items-center bg-white rounded-lg'>
                <img src={user.image} alt="User image" className='w-10 h-10 rounded-full' />
                <p className='font-bold '>{user.userName}</p>
              </div>
            )}
            <input 
            type="text"
            value={about}
            onChange={(event) => setAbout(event.target.value)}
            placeholder='What is your post about?' 
            className='outline-none text-base sm:text-lg border-b-2 border-grey-200 p-2'/>
            <div className='flex flex-col'>
              <div>
                <p className='mb-2 font-semibold text-lg sm:text-xl'>
                  Choose Post Category
                </p>
                <select name="" id="" onChange={(event) => setCategory(event.target.value)} className='outline-none w-4/5 border-b-2 text-base border-grey-200 p-2 rounded-md cursor-pointer'>
                  <option value="other" className='bg-white'>Select Post Category</option>
                  {categories.map((category) => (
                    <option value={category.name} className='text-base border-0 outline-none capitalize bg-white text-black' key={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className='flex justify-end items-end mt-5'>
                <button type='button' onClick={savePin} className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none'>
                  Save Post
                </button>
              </div>
            </div>

        </div>
      </div>
    </div>
  )
}

export default CreatePin