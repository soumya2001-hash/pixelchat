import sanityClient, { createClient, SanityClient } from '@sanity/client';
import imageUrlBuider from '@sanity/image-url';

export const client = createClient({
    projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset: process.env.REACT_APP_SANITY_PROJECT_DATASET,
    apiVersion: '2021-10-21',
    useCdn: true,
    token: process.env.REACT_APP_SANITY_PROJECT_TOKEN
});

const builder = imageUrlBuider(client);

export const urlFor = (source) => builder.image(source);