import React from 'react';
import { Image, Message } from 'semantic-ui-react';
import { Photo } from './StateProvider';

interface Props {
  photos: Array<Photo>;
}

export const Gallery = ({ photos }: Props) => (
  <ul>
    {photos.map(photo => (
      <li key={photo.uid}>
        <Image src={decodeURIComponent(photo.url)} />
        <Message>
          <p>{photo.description}</p>
        </Message>
      </li>
    ))}
  </ul>
);
