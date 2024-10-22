import React from 'react'
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { replace, useNavigate } from 'react-router-dom';
import {FcGoogle} from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import logo32 from '../assets/logo3-2.png'
import logo_white1 from '../assets/logo_white1.png';
import logo_white_final from '../assets/logo_white_final.png'
import {jwtDecode} from "jwt-decode";
import { client } from '../client.js';

const Login = () => {
    const navigate = useNavigate();
    const user = false;
    const responseGoogle = (response) => {
        const decoded = jwtDecode(response.credential);
        // console.log(decoded);
        localStorage.setItem('user', JSON.stringify(decoded));
        const {name, sub, picture, email} = jwtDecode(response.credential);
        

        const doc = {
            _id : sub,
            _type : 'user',
            userName : name, 
            image : picture,
            email : email,
        };

        client.createIfNotExists(doc)
        .then(() => {
            navigate('/', {replace:true})
        })
        
    }
  return (
    <div className='flex justify-start items-center flex-col h-screen'>
        <div className='relative w-full h-full'>
            <video 
            src={shareVideo}
            typeof='video/mp4'
            loop={true}
            controls={false}
            muted={true}
            autoPlay={true}
            className='w-full h-full object-cover' />
        </div>
        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
            <div className='p-5'>
                <img src={logo_white_final} alt="logo" width={130} className='rounded-md'/>
            </div>
            <div className='shadow-2xl'>
                {user? (
                    <div>Loggen IN</div>
                ) : (
                    <GoogleLogin
                        onSuccess={responseGoogle}
                        onError={responseGoogle }
                    />
                )}
            </div>
        </div>
    </div>
  )
}

export default Login