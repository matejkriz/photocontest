import React from 'react';
import Link from 'next/link';
import { Message } from 'semantic-ui-react';
import 'react-image-gallery/styles/css/image-gallery.css';
import ImageGallery from 'react-image-gallery';
import { Photo } from './StateProvider';
import Rating from 'react-rating';

interface Props {
  photos: Array<Photo>;
}

export const Gallery = ({ photos }: Props) =>
  photos && photos.length ? (
    <ImageGallery
      items={photos.map(photo => ({
        original: decodeURIComponent(photo.url),
        thumbnail: decodeURIComponent(photo.url),
      }))}
      infinite={false}
      showPlayButton={false}
      showIndex
      lazyLoad
      renderCustomControls={() => <Rating />}
    />
  ) : (
    <Message warning>
      Zatím zde nejsou žádné fotografie. Což takhle nějakou{' '}
      <Link href="/upload">
        <a>nahrát</a>
      </Link>
      ?
    </Message>
  );
