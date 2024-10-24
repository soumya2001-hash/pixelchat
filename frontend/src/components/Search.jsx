import React, {useState, useEffect} from 'react';
import MasonryLayout from './MasonryLayout.jsx';
import { client } from '../client.js';
import { feedQuery, searchQuery } from '../utils/data.js';
import Spinner from './Spinner.jsx';

const Search = ({searchTerm}) => {

  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(searchTerm) {
      setLoading(true);
      const query = searchQuery(searchTerm.toLowerCase());
      client
      .fetch(query)
      .then((data) => {
        setPins(data);
        setLoading(false);
      })
    }else{
      client
      .fetch(feedQuery)
      .then((data)  => {
        setPins(data);
        setLoading(false);
      })
    }
  }, [searchTerm])
  

  return (
    <div>
      {loading && <Spinner message='Searching posts...'/>}
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== '' && !loading && (
        <div className='flex justify-center font-bold items-center w-full text-xl mt-2'>
          No posts found!
        </div>
      ) }
    </div>
  )
}

export default Search