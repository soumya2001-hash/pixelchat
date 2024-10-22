import React,{useState, useEffect} from 'react';
import {AiOutlineLogout} from 'react-icons/ai';
import {useParams, useNavigate} from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import axios from 'axios';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data.js';
import { client } from '../client.js';
import MasonryLayout from './MasonryLayout.jsx';
import Spinner from './Spinner.jsx';

const randomImage = 'https://source.unsplash.com/1600x900/?nature,photography,technology';

// const response = axios.get('https://api.unsplash.com/photos/random');
// console.log(response);


const UNSPLASH_ACCESS_KEY = 'LOdXlAGwMTGGcKnv71mrLKjqMCtF9-6h2ZVK3QFCvgQ'; // Replace with your actual Unsplash access key

const fetchRandomImage = async () => {
  try {
    const response = await axios.get('https://api.unsplash.com/photos/random', {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });
    console.log(response.data.urls.raw);
    return (response.data.urls.raw); // The response will contain image data
  } catch (error) {
    console.error('Error fetching random image from Unsplash:', error);
  }
};

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full width-20 outline-none';
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full width-20 outline-none';


const UserProfile = () => {

  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Posts') // Posts || Likes
  const [activeBtn, setActiveBtn] = useState('Posts');
  const [randomImageUrl, setRandomImageUrl] = useState(null);

  const navigate = useNavigate();
  const {userId} = useParams();
  // console.log(userId);

  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query)
    .then((data) => {
      setUser(data[0])
    })
  }, [userId])
  
  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        const response = await axios.get('https://api.unsplash.com/photos/random', {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        });
        setRandomImageUrl(response.data.urls.raw); // Set the random image URL in state
      } catch (error) {
        console.error('Error fetching random image from Unsplash:', error);
      }
    };

    fetchRandomImage();
  }, []);

  useEffect(() => {
    const fetchPins = async () => {
      const query = text === 'Posts' ? userCreatedPinsQuery(userId) : userSavedPinsQuery(userId);
      console.log(query);
      client
      .fetch(query)
      .then((data) => {
        setPins(data);
        console.log(data);
        console.log(userId);
      });
    };
    fetchPins();
  }, [text, userId]);

  
  

  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    navigate('/login');
  }

  if(!user) {
    return <Spinner message='Loading profile...'/>
  }

  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            {randomImageUrl && (
              <img src={randomImageUrl} className='w-full h-370 xl:h-510 shadow-lg object-cover' alt="banner picture" />
            )
            }
            <img src={user.image} alt="User picture" className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover' />
            <h1 className='font-bold text-3xl text-center mt-3'>
              {user.userName}
            </h1>
            <div className='absolute top-0 right-0 z-1 p-2'>
              {userId === user._id && (
                <div>
                  <button
                  type='button'
                  className='bg-white p-2 rounded-full cursor-pointer outline-none shadow-md'
                  onClick={handleLogout}
                  >
                    <AiOutlineLogout color='red' fontSize={21}/>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className='text-center mb-7 flex flex-row gap-3 justify-center '>
            <button type='button' onClick={(event) => {
              setText(event.target.textContent);
              setActiveBtn('Posts');
              }}
              className={`${activeBtn === 'Posts' ? activeBtnStyles : notActiveBtnStyles}`}>
                Posts
              </button>
              <button type='button' onClick={(event) => {
              setText(event.target.textContent);
              setActiveBtn('Likes');
              }}
              className={`${activeBtn === 'Likes' ? activeBtnStyles : notActiveBtnStyles}`}>
                Likes
              </button>
          </div>
          {pins?.length ? (
            <div className='px-2'>
            <MasonryLayout pins={pins} />
          </div>
          ) : (
            <div className='flex justify-center font-bold items-center w-full text-xl mt-2'>
              No Posts found!
            </div>
          ) }
          
        </div>
      </div>
    </div>
  )
}

export default UserProfile