import React from 'react';
import Masonry from 'react-masonry-css';

import Pin from './Pin.jsx';

const breakPointObject = {
  default: 4,
  3000: 6,
  2000: 5,
  1500: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({pins}) => {
  return (
    <Masonry className='flex animate-slide-fwd ' breakpointCols={breakPointObject} >
      {pins?.map((pin) => 
        <Pin key={pin._id}  pin={pin} className='w-max'/>
      )}
    </Masonry>
  )
}

export default MasonryLayout