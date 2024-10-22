import React, {useState} from 'react'
import { urlFor, client } from '../client';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import {MdDownloadForOffline} from 'react-icons/md';
import {AiTwotoneDelete} from 'react-icons/ai';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import {BsFillArrowUpRightCircleFill} from 'react-icons/bs';
import { fetchUser } from '../utils/fetchUser.js';


const Pin = ({pin}) => {

  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const navigate = useNavigate();
  const user = fetchUser();
  

  const { postedBy, image, _id, save } = pin;
  

  // let alreadySaved = pin?.save?.filter((item) => item?.postedBy?._id === user.sub) ;
  // console.log(alreadySaved.length);

  const alreadySaved = pin?.save?.some((item) => item?.postedBy?._id === user?.sub);

  // console.log(alreadySaved);

  const savePin = (id) => {
    if (!alreadySaved) {
      setSavingPost(true);
  
      // Ensure pin.save is an array
      pin.save = pin.save || []; // Initialize if undefined
  
      // Optimistic UI update
      pin.save = [...pin.save, { postedBy: { _id: user?.sub } }];
      setSavingPost(false); // Stop loading
  
      // Send the save request to the server
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [{
          _key: uuidv4(),
          userID: user?.sub,
          postedBy: {
            _type: 'postedBy',
            _ref: user?.sub
          }
        }])
        .commit()
        .then(() => {
          console.log("Pin saved successfully");
        })
        .catch(err => {
          console.error('Error saving pin:', err);
          // Revert the optimistic update if it fails
          pin.save = pin.save.filter(item => item.postedBy._id !== user?.sub);
        });
    }
  };
  
  
  const deletePin = (id) => {
    client
    .delete(id)
    .then(() => {
      window.location.reload();
    })
  }


  return (
    <div className='m-2 '>
      <div 
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
      >
        {/* '{console.log(image)}' */}
        <img className='rounded-lg w-full ' alt='user-post' src={image?.asset ? urlFor(image).width(250).url() : 'https://png.pngtree.com/png-vector/20220617/ourmid/pngtree-error-icon-computer-alert-illustration-png-image_5125755.png'}/>
        {postHovered && (
          <div
            className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50 '
            style={{height:'100%'}}
          >
            <div className='flex items-center justify-between'>
              <div className='flex gap-2'>
                <a 
                  href={`${image?.asset?.url}?dl=`}
                  download={true}
                  onClick={(event) => event.stopPropagation()}
                  className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                  >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                  <button type='button' className='flex flex-row justify-center items-center gap-2  bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none '>
                    <FaHeart className='text-white'/>
                    {pin?.save?.length !== 0 ? (<p>{pin.save.length}</p>) : null}
                  </button>
              ) : (
                  <button type='button' className='flex flex-row justify-center items-center gap-2  bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none' onClick={(event) => {
                    event.stopPropagation();
                    savePin(_id);
                    }}>
                    <FaRegHeart className='text-white'/>
                    {Array.isArray(pin?.save) && pin.save.length > 0 ? <p>{pin.save.length}</p> : null}
                  </button>
              )}
            </div>
            <div className='flex justify-between items-center gap-2 w-full'> 
              {
                postedBy?._id === user?.sub && (
                  <button 
                    type='button'
                    onClick={ (event) => {
                      event.stopPropagation();
                      deletePin(_id);
                    }}
                    className='bg-white p-2 opacity-70 hover:opacity-100  font-bold text-dark text-base rounded-3xl hover:shadow-md outline-none'
                  >
                    <AiTwotoneDelete />
                  </button>
                )
              }
            </div>
          </div>
        )}
      </div>

      <Link to={`user-profile/${postedBy?._id}`} className='flex gap-2 mt-2 items-center'>
        <img 
          className='w-8 h-8 rounded-full object-cover'
          src={postedBy?.image}
          alt='user-profile'
        />
        <p className='font-semibold capitalize'>
          {postedBy?.userName}
        </p>
      </Link>
    </div>
  )
}

export default Pin