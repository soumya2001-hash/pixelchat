import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../client.js';
import MasonryLayout from './MasonryLayout.jsx';
import Spinner from './Spinner.jsx';
import { feedQuery, searchQuery } from '../utils/data.js';

const Feed = () => {

  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const {categoryID} = useParams();

  useEffect(() => {
    setLoading(true);
    if(categoryID){
      const query = searchQuery(categoryID);
      client.fetch(query)
      .then((data) => {
        setPins(data);
        setLoading(false);
      })
    } else {
      client.fetch(feedQuery)
      .then((data) => {
        setPins(data);
        setLoading(false);
      })
    }
  }, [categoryID])
  

  if(loading) return <Spinner message='We are adding new ideas to your feed!'/>
  if(!pins?.length) return (
    <div className='text-xl text-center mt-40'>
      No posts found!
    </div>
  )
  return (
    <div>
      {pins && <MasonryLayout pins={pins}/>}
    </div>
  )
}

export default Feed